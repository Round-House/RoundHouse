import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { RoomEntity } from 'src/room/models/room.entity';
import { Room } from 'src/room/models/room.interface';
import { CreateMessageDto } from 'src/stream/message/models';
import { MessageEntity } from 'src/stream/message/models/message.entity';
import { Message } from 'src/stream/message/models/message.interface';
import { StreamDeliverableDto } from 'src/stream/models';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { Stream } from 'src/stream/models/stream.interface';
import { UserEntity } from 'src/user/models/user.entity';
import { User } from 'src/user/models/user.interface';
import { LessThan, Repository } from 'typeorm';
import {
    Pagination,
    IPaginationOptions,
    paginate,
    IPaginationMeta,
} from 'nestjs-typeorm-paginate';
import { Cache, Store } from 'cache-manager';
import * as Redis from 'redis';

interface RedisCache extends Cache {
    store: RedisStore;
}

interface RedisStore extends Store {
    name: 'redis';
    getClient: () => Redis.RedisClient;
    isCacheableValue: (value: any) => boolean;
}

@Injectable()
export class RoomStreamService {
    cache: Redis.RedisClient;

    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(StreamEntity)
        private readonly streamRepository: Repository<StreamEntity>,
        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: RedisCache,
    ) {
        this.cache = cacheManager.store.getClient();
    }

    createMessage(
        roomAddress: string,
        message: CreateMessageDto,
        user: any,
    ): Observable<any> {
        if (user.username === undefined) {
            throw Error(`Invalid username.`);
        }
        return from(
            this.userRepository.findOneOrFail({
                where: { username: user.username },
            }),
        ).pipe(
            switchMap((user: User) => {
                if (roomAddress === undefined) {
                    throw Error(`Invalid room address.`);
                }
                return from(
                    this.roomRepository.findOneOrFail({
                        where: { roomAddress },
                        relations: [
                            'memberships',
                            'memberships.user',
                            'stream',
                        ],
                    }),
                ).pipe(
                    switchMap((room: Room) => {
                        if (
                            room.memberships.includes(
                                room.memberships.find(
                                    (membership) =>
                                        membership.user.username ===
                                        user.username,
                                ),
                            )
                        ) {
                            const newMessage = new MessageEntity();
                            newMessage.text = message.text;
                            newMessage.comments = new StreamEntity();
                            newMessage.account = user;

                            //TODO: Split function and add redis
                            return from(
                                this.streamRepository.findOneOrFail({
                                    where: { id: room.stream.id },
                                    relations: {
                                        messages: true,
                                    },
                                }),
                            ).pipe(
                                switchMap((stream: Stream) => {
                                    return from(
                                        this.messageRepository.save(newMessage),
                                    ).pipe(
                                        switchMap((message: Message) => {
                                            stream.messages.push(message);

                                            return from(
                                                this.streamRepository.save(
                                                    stream,
                                                ),
                                            ).pipe(
                                                map(() => {
                                                    return message;
                                                }),
                                                catchError((err) =>
                                                    throwError(() => err),
                                                ),
                                            );
                                        }),
                                    );
                                }),
                                catchError((err) => throwError(() => err)),
                            );
                        } else {
                            throw Error(
                                `User ${user.username} is not in room ${room.roomAddress}.`,
                            );
                        }
                    }),
                    catchError((err) => throwError(() => err)),
                );
            }),
            catchError((err) => throwError(() => err)),
        );
    }

    getStream(
        roomAddress: string,
        user: any,
        options: IPaginationOptions,
        lastMessage: Date,
    ): Observable<StreamDeliverableDto> {
        if (user.username === undefined) {
            throw Error(`Invalid username.`);
        }
        return from(
            this.userRepository.findOneOrFail({
                where: { username: user.username },
            }),
        ).pipe(
            switchMap((user: User) => {
                if (roomAddress === undefined) {
                    throw Error(`Invalid room address.`);
                }
                return from(
                    this.roomRepository.findOneOrFail({
                        where: { roomAddress },
                        relations: [
                            'memberships',
                            'memberships.user',
                            'stream',
                        ],
                    }),
                ).pipe(
                    switchMap((room: Room) => {
                        if (
                            room.memberships.includes(
                                room.memberships.find(
                                    (membership) =>
                                        membership.user.username ===
                                        user.username,
                                ),
                            )
                        ) {
                            //TODO: Split function and add redis
                            return from(
                                this.streamRepository.findOneOrFail({
                                    where: { id: room.stream.id },
                                }),
                            ).pipe(
                                switchMap((stream: Stream) => {
                                    const deliverable =
                                        new StreamDeliverableDto();
                                    deliverable.stream = stream;

                                    return from(
                                        paginate<Message>(
                                            this.messageRepository,
                                            options,
                                            {
                                                relations: [
                                                    'account',
                                                    'comments',
                                                ],
                                                where: {
                                                    stream,
                                                    createdAt: LessThan(
                                                        new Date(lastMessage),
                                                    ),
                                                },
                                                order: { createdAt: 'DESC' },
                                            },
                                        ),
                                    ).pipe(
                                        map(
                                            (
                                                messages: Pagination<
                                                    Message,
                                                    IPaginationMeta
                                                >,
                                            ) => {
                                                deliverable.messages = messages;
                                                return deliverable;
                                            },
                                        ),
                                    );
                                }),
                                catchError((err) => throwError(() => err)),
                            );
                        } else {
                            throw Error(
                                `User ${user.username} is not in room ${room.roomAddress}.`,
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
