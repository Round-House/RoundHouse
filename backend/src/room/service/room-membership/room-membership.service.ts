import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, switchMap, map, catchError, throwError } from 'rxjs';
import { MemberEntity } from 'src/room/member/models/member.entity';
import { Member } from 'src/room/member/models/member.interface';
import { RoomEntity } from 'src/room/models/room.entity';
import { Room } from 'src/room/models/room.interface';
import { UserEntity } from 'src/user/models/user.entity';
import { User } from 'src/user/models/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RoomMembershipService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(MemberEntity)
        private readonly memberRepository: Repository<MemberEntity>,){}

    getMebershipsOfUser(username: string): Observable<Member[]> {
        return from(
            this.memberRepository
                .createQueryBuilder('member')
                .leftJoin('member.user', 'user')
                .where('user.username = :username', { username })
                .leftJoinAndSelect('member.room', 'room')
                .getMany(),
        );
    }


    joinRoom(roomAddress: string, userJwtDto: any): Observable<User> {
        return from(
            this.roomRepository.findOneOrFail({
                where: { roomAddress },
                relations: ['memberships', 'memberships.user'],
            }),
        ).pipe(
            switchMap((room: Room) => {
                return from(
                    this.userRepository.findOneOrFail({
                        where: { username: userJwtDto.username },
                        relations: ['memberships', 'memberships.room'],
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

                            this.memberRepository.save(newMembership);

                            room.memberships.push(newMembership);
                            return from(this.roomRepository.save(room)).pipe(
                                map(() => {
                                    return user;
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
                        const membership = room.memberships.find(
                            (membership) =>
                                membership.user.username === user.username,
                        );
                        if (!room.memberships.includes(membership)) {
                            throw Error(
                                `User ${user.username} is not in room ${room.roomAddress}.`,
                            );
                        } else {
                            this.memberRepository.remove(membership);

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
