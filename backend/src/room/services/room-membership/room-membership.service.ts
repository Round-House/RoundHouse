import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    IPaginationMeta,
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';
import { from, Observable, switchMap, map, catchError, throwError } from 'rxjs';
import { MemberEntity } from 'src/room/member/models/member.entity';
import { MemberRole } from 'src/room/member/models/member.interface';
import { TreeRoomDto } from 'src/room/models';
import { RoomEntity } from 'src/room/models/room.entity';
import { Room } from 'src/room/models/room.interface';
import { UserEntity } from 'src/user/models/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RoomMembershipService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
        @InjectRepository(MemberEntity)
        private readonly memberRepository: Repository<MemberEntity>,
        private dataSource: DataSource,
    ) {}

    getRootRooms(user: UserEntity): Observable<TreeRoomDto[]> {
        return from(
            this.roomRepository
                .createQueryBuilder('room')
                .leftJoin('room.memberships', 'membership')
                .leftJoin('membership.user', 'user')
                .where('user.username = :username', { username: user.username })
                .andWhere('room.parentRoom is null')
                .getMany(),
        ).pipe(
            map((rooms: Room[]) => {
                const treeRoomList = rooms.map((room) => new TreeRoomDto(room));
                return treeRoomList;
            }),
            catchError((err) => throwError(() => err)),
        );
    }

    getSubRooms(room: RoomEntity): Observable<RoomEntity> {
        return from(
            this.dataSource
                .getTreeRepository(RoomEntity)
                .findDescendantsTree(room),
        ).pipe(
            map((rooms: RoomEntity) => {
                return rooms;
            }),
            catchError((err) => throwError(() => err)),
        );
    }

    getUsersSubRooms(
        user: UserEntity,
        room: RoomEntity,
    ): Observable<TreeRoomDto[]> {
        return from(
            this.dataSource.getTreeRepository(RoomEntity).findDescendants(room),
        ).pipe(
            switchMap((roomInTree: RoomEntity[]) => {
                return from(
                    this.roomRepository
                        .createQueryBuilder('room')
                        .leftJoin('room.memberships', 'membership')
                        .leftJoin('membership.user', 'user')
                        .where('user.username = :username', {
                            username: user.username,
                        })
                        .getMany(),
                ).pipe(
                    map((userRooms: RoomEntity[]) => {
                        const userRoomAddresses = userRooms.map(
                            (room) => room.roomAddress,
                        );
                        const tempRoomList = roomInTree.filter((room) =>
                            userRoomAddresses.includes(room.roomAddress),
                        );
                        const treeRoomList = tempRoomList.map(
                            (room) => new TreeRoomDto(room),
                        );
                        return treeRoomList;
                    }),
                    catchError((err) => throwError(() => err)),
                );
            }),
            catchError((err) => throwError(() => err)),
        );
    }

    membersInRoom(
        room: RoomEntity,
        options: IPaginationOptions,
    ): Observable<Pagination<MemberEntity>> {
        return from(
            paginate<MemberEntity>(this.memberRepository, options, {
                relations: ['user'],
                where: { room: { id: room.id } },
            }),
        ).pipe(
            map((members: Pagination<MemberEntity, IPaginationMeta>) => {
                return members;
            }),
        );
    }

    joinRoom(
        room: RoomEntity,
        user: UserEntity,
        member?: MemberEntity,
    ): Observable<UserEntity> {
        if (member) {
            throw Error(
                `User ${user.username} is already in room ${room.roomAddress}.`,
            );
        } else {
            const newMembership = new MemberEntity();
            newMembership.user = user;
            newMembership.room = room;

            if (room.memberships.length === 0) {
                newMembership.role = MemberRole.OWNER;
            }

            this.memberRepository.save(newMembership);

            room.memberships.push(newMembership);
            return from(this.roomRepository.save(room)).pipe(
                map(() => {
                    return user;
                }),
                catchError((err) => throwError(() => err)),
            );
        }
    }

    leaveRoom(room: RoomEntity, member: MemberEntity): Observable<RoomEntity> {
        this.memberRepository.remove(member);

        return from(this.roomRepository.save(room)).pipe(
            map((room: RoomEntity) => {
                return room;
            }),
            catchError((err) => throwError(() => err)),
        );
    }
}
