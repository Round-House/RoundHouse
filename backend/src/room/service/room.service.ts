import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, switchMap, map, catchError, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateRoomDto } from '../models';
import { RoomEntity } from '../models/room.entity';
import { Room } from '../models/room.interface';
import { UserEntity } from 'src/user/models/user.entity';
import { User } from 'src/user/models/user.interface';
import { StreamEntity } from 'src/stream/models/stream.entity';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    findAll(): Observable<Room[]> {
        return from(this.roomRepository.find());
    }

    createRoom(roomDto: CreateRoomDto, user: any): Observable<Room> {
        const newRoom = new RoomEntity();
        newRoom.name = roomDto.name;
        newRoom.description = roomDto.description;
        newRoom.childRooms = [];
        newRoom.stream = new StreamEntity();
        newRoom.stream.messages = [];

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
                        newRoom.owner = owner;
                        newRoom.members = [owner];

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
                                        map((room: Room) => {
                                            if (
                                                newRoom.parentRoom
                                                    .childRooms === undefined
                                            ) {
                                                //TODO: remove parent from room before adding
                                                newRoom.parentRoom.childRooms =
                                                    [room];
                                            } else {
                                                newRoom.parentRoom?.childRooms.push(
                                                    room,
                                                );
                                            }
                                            return room;
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
