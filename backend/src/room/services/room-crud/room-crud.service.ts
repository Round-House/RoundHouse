import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, switchMap, map, catchError, throwError } from 'rxjs';
import { MemberEntity } from 'src/room/member/models/member.entity';
import { MemberRole } from 'src/room/member/models/member.interface';
import { CreateRoomDto } from 'src/room/models';
import { RoomEntity } from 'src/room/models/room.entity';
import { Room } from 'src/room/models/room.interface';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { User } from 'src/user/models/user.interface';
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
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private roomMembershipService: RoomMembershipService,
    ) {}

    findAll(options: IPaginationOptions): Observable<Pagination<Room>> {
        return from(
            paginate<Room>(this.roomRepository, options, {
                relations: ['parentRoom', 'memberships', 'stream'],
            }),
        ).pipe(map((rooms: Pagination<Room>) => rooms));
    }

    createRoom(roomDto: CreateRoomDto, user: any): Observable<Room> {
        const newRoom = new RoomEntity();
        newRoom.name = roomDto.name;
        newRoom.description = roomDto.description;
        newRoom.stream = new StreamEntity();
        console.log(user);

        if (roomDto.parentRoomAddress === undefined) {
            roomDto.parentRoomAddress = '';
        }

        return from(
            this.roomRepository.findOne({
                where: { roomAddress: roomDto.parentRoomAddress },
            }),
        ).pipe(
            switchMap((parent: Room) => {
                if (roomDto.parentRoomAddress && !parent) {
                    throw Error('Cannot find parent room.');
                }
                newRoom.parentRoom = parent;
                newRoom.roomAddress =
                    (parent ? parent.roomAddress + '.' : '') + roomDto.name;

                return from(
                    this.userRepository.findOneOrFail({
                        where: { username: user.username },
                    }),
                ).pipe(
                    switchMap((owner: User) => {
                        return from(
                            this.roomRepository.findOne({
                                where: { roomAddress: newRoom.roomAddress },
                            }),
                        ).pipe(
                            switchMap((addressMatch: Room) => {
                                if (addressMatch) {
                                    throw Error(
                                        `A room with the address ${newRoom.roomAddress} allready exists on the server.`,
                                    );
                                } else {
                                    return from(
                                        this.roomRepository.save(newRoom),
                                    ).pipe(
                                        switchMap((room: Room) => {
                                            return from(
                                                this.roomMembershipService.joinRoom(
                                                    room.roomAddress,
                                                    user,
                                                ),
                                            ).pipe(
                                                map(() => {
                                                    return room;
                                                }),
                                            );
                                        }),
                                        catchError((err) =>
                                            throwError(() => err),
                                        ),
                                    );
                                }
                            }),
                            catchError((err) => throwError(() => err)),
                        );
                    }),
                    catchError((err) => throwError(() => err)),
                );
            }),
            catchError((err) => throwError(() => err)),
        );
    }
}
