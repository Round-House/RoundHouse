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
import { MemberEntity } from '../member/models/member.entity';
import { MemberRole } from '../member/models/member.interface';

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

    //TODO: Move to more logical place and rewrite
    getRoomsOfUser(username: string): Observable<Room[]> {
        return from(
            this.roomRepository
                .createQueryBuilder('room')
                .leftJoin('room.owner', 'owner')
                .where('owner.username = :username', { username })
                .getMany(),
        );
    }

    createRoom(roomDto: CreateRoomDto, user: any): Observable<Room> {
        const newRoom = new RoomEntity();
        newRoom.name = roomDto.name;
        newRoom.description = roomDto.description;
        newRoom.stream = new StreamEntity();

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
                        const newMember = new MemberEntity();
                        newMember.user = owner;
                        newMember.room = newRoom;
                        newMember.role = MemberRole.OWNER;

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

    joinRoom(roomAddress: string, userJwtDto: any): Observable<Room> {
        return from(
            this.roomRepository.findOneOrFail({
                where: { roomAddress },
                relations: {
                    memberships: {
                        user: true,
                    },
                },
            }),
        ).pipe(
            switchMap((room: Room) => {
                return from(
                    this.userRepository.findOneOrFail({
                        where: { username: userJwtDto.username },
                    }),
                ).pipe(
                    switchMap((user: User) => {
                        if (
                            room.memberships.includes(
                                room.memberships.find(
                                    (membership) =>
                                        membership.user.username ===
                                        user.username,
                                ),
                            )
                        ) {
                            throw Error(
                                `User ${user.username} is already in room ${room.roomAddress}.`,
                            );
                        } else {
                            const newMembership = new MemberEntity();
                            newMembership.user = user;
                            newMembership.room = room;

                            room.memberships.push(newMembership);
                            return from(this.roomRepository.save(room)).pipe(
                                map((room: Room) => {
                                    return room;
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

    leaveRoom(roomAddress: string, userJwtDto: any): Observable<Room> {
        return from(
            this.roomRepository.findOneOrFail({
                where: { roomAddress },
                relations: {
                    memberships: {
                        user: true,
                    },
                },
            }),
        ).pipe(
            switchMap((room: Room) => {
                return from(
                    this.userRepository.findOneOrFail({
                        where: { username: userJwtDto.username },
                    }),
                ).pipe(
                    switchMap((user: User) => {
                        if (
                            !room.memberships.includes(
                                room.memberships.find(
                                    (membership) =>
                                        membership.user.username ===
                                        user.username,
                                ),
                            )
                        ) {
                            throw Error(
                                `User ${user.username} is not in room ${room.roomAddress}.`,
                            );
                        } else {
                            // TODO: Check if this works
                            room.memberships.splice(
                                room.memberships.indexOf(
                                    room.memberships.find(
                                        (membership) =>
                                            membership.user.username ===
                                            user.username,
                                    ),
                                ),
                                1,
                            );
                            return from(this.roomRepository.save(room)).pipe(
                                map((room: Room) => {
                                    return room;
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
