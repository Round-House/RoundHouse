import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, switchMap, map, catchError, throwError } from 'rxjs';
import { CreateRoomDto } from 'src/room/models';
import { RoomEntity } from 'src/room/models/room.entity';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { UserEntity } from 'src/user/models/user.entity';
import {
    Pagination,
    IPaginationOptions,
    paginate,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { RoomMembershipService } from '../room-membership/room-membership.service';

@Injectable()
export class RoomCrudService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
        private roomMembershipService: RoomMembershipService,
    ) {}

    getRoom(roomAddress: string, relations: string[]): Observable<RoomEntity> {
        return from(
            this.roomRepository.findOne({
                where: {
                    roomAddress,
                },
                relations: relations,
            }),
        ).pipe(
            map((room: RoomEntity) => {
                return room;
            }),
        );
    }

    findAll(options: IPaginationOptions): Observable<Pagination<RoomEntity>> {
        return from(
            paginate<RoomEntity>(this.roomRepository, options, {
                relations: ['parentRoom', 'memberships', 'stream'],
            }),
        ).pipe(map((rooms: Pagination<RoomEntity>) => rooms));
    }

    createRoom(
        roomDto: CreateRoomDto,
        user: UserEntity,
    ): Observable<RoomEntity> {
        const newRoom = new RoomEntity();
        newRoom.name = roomDto.name;
        newRoom.description = roomDto.description;
        newRoom.stream = new StreamEntity();
        newRoom.handle = roomDto.name.replace(/ /g, '-').toLowerCase();

        if (roomDto.parentRoomAddress === undefined) {
            roomDto.parentRoomAddress = '';
        }

        return from(
            this.roomRepository.findOne({
                where: { roomAddress: roomDto.parentRoomAddress },
            }),
        ).pipe(
            switchMap((parent: RoomEntity) => {
                const handleCheck = /^[a-z0-9\-]+$/g;
                if (!handleCheck.test(newRoom.handle)) {
                    throw Error('Room handle must be alphanumeric');
                }
                if (roomDto.parentRoomAddress && !parent) {
                    throw Error('Cannot find parent room.');
                }
                newRoom.parentRoom = parent;
                newRoom.roomAddress =
                    (parent ? parent.roomAddress + '.' : '') + newRoom.handle;

                return from(
                    this.roomRepository.findOne({
                        where: { roomAddress: newRoom.roomAddress },
                    }),
                ).pipe(
                    switchMap((addressMatch: RoomEntity) => {
                        if (addressMatch) {
                            throw Error(
                                `A room with the address ${newRoom.roomAddress} allready exists on the server.`,
                            );
                        } else {
                            return from(this.roomRepository.save(newRoom)).pipe(
                                switchMap((room: RoomEntity) => {
                                    return from(
                                        this.getRoom(room.roomAddress, [
                                            'memberships',
                                        ]),
                                    ).pipe(
                                        switchMap((room: RoomEntity) => {
                                            return from(
                                                this.roomMembershipService.joinRoom(
                                                    room,
                                                    user,
                                                ),
                                            ).pipe(
                                                map(() => {
                                                    room.memberships = null;
                                                    return room;
                                                }),
                                            );
                                        }),
                                        catchError((err) =>
                                            throwError(() => err),
                                        ),
                                    );
                                }),
                                catchError((err) => throwError(() => err)),
                            );
                        }
                    }),
                    catchError((err) => throwError(() => err)),
                );
            }),
            catchError((err) => throwError(() => err)),
        );
    }
}
