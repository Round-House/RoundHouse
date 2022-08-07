import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    catchError,
    from,
    map,
    Observable,
    switchMap,
    throwError,
    bindCallback,
} from 'rxjs';
import { RoomEntity } from 'src/room/models/room.entity';
import { MessageEntity } from 'src/stream/message/models/message.entity';
import { StreamDeliverableDto } from 'src/stream/models';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { UserEntity } from 'src/user/models/user.entity';
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
        @InjectRepository(StreamEntity)
        private readonly streamRepository: Repository<StreamEntity>,
        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: RedisCache,
    ) {
        this.cache = cacheManager.store.getClient();
    }

    createMessage(
        room: RoomEntity,
        stream: StreamEntity,
        user: UserEntity,
        message: string,
    ): Observable<MessageEntity> {
        const newMessage = new MessageEntity();
        newMessage.text = message;
        newMessage.comments = new StreamEntity();
        newMessage.account = user;

        return from(this.messageRepository.save(newMessage)).pipe(
            switchMap((message: MessageEntity) => {
                stream.messages.push(message);

                return from(this.streamRepository.save(stream)).pipe(
                    map(() => {
                        // Store message in cache of room address
                        this.cacheMessages(room.roomAddress, [message]);

                        return message;
                    }),
                    catchError((err) => throwError(() => err)),
                );
            }),
        );
    }

    private cacheMessages(roomAddress: string, messages: MessageEntity[]) {
        const messageStrings: string[] = messages.map(
            (message: MessageEntity) => {
                return JSON.stringify(message);
            },
        );

        this.cache.rpush('room:' + roomAddress + ':messages', messageStrings);
        this.cache.ltrim('room:' + roomAddress + ':messages', -10, -1);
        this.cache.expire('room:' + roomAddress + ':messages', 1200);
    }

    readStream(
        room: RoomEntity,
        stream: StreamEntity,
        options: IPaginationOptions,
        lastMessage: Date,
    ): Observable<StreamDeliverableDto> {
        const deliverable = new StreamDeliverableDto();
        deliverable.stream = stream;

        lastMessage.getTime() >= Date.now();

        const cacheExistsObs = bindCallback(this.cache.exists);

        return from(
            cacheExistsObs.call(
                this.cache,
                'room:' + room.roomAddress + ':messages',
            ),
        ).pipe(
            switchMap((cacheExists: [Error, number]) => {
                if (cacheExists[1] === 1) {
                    return from(
                        this.getMessageCache(room.roomAddress).pipe(
                            map((messages: MessageEntity[]) => {
                                deliverable.messages = messages;
                                return deliverable;
                            }),
                        ),
                    );
                } else {
                    return from(
                        this.getMessagePostgres(
                            options,
                            lastMessage,
                            stream,
                            room,
                        ),
                    ).pipe(
                        map((messages: MessageEntity[]) => {
                            deliverable.messages = messages;
                            return deliverable;
                        }),
                        catchError((err) => throwError(() => err)),
                    );
                }
            }),
        );
    }

    private getMessageCache(roomAddress: string): Observable<MessageEntity[]> {
        const cacheLrangeObs = bindCallback(this.cache.lrange);

        return from(
            cacheLrangeObs.call(
                this.cache,
                'room:' + roomAddress + ':messages',
                0,
                9,
            ),
        ).pipe(
            map((messages: [Error, string[]]) => {
                if (messages[0] instanceof Error) {
                    throw messages[0];
                } else {
                    const messageObjects: MessageEntity[] = messages[1]
                        .map((message: string) => {
                            return JSON.parse(message);
                        })
                        .reverse();
                    return messageObjects;
                }
            }),
        );
    }

    private getMessagePostgres(
        options: IPaginationOptions,
        lastMessage: Date,
        stream: StreamEntity,
        room: RoomEntity,
    ): Observable<MessageEntity[]> {
        return from(
            paginate<MessageEntity>(this.messageRepository, options, {
                relations: ['account', 'comments'],
                where: {
                    stream,
                    createdAt: LessThan(new Date(lastMessage)),
                },
                order: {
                    createdAt: 'DESC',
                },
            }),
        ).pipe(
            map((messages: Pagination<MessageEntity, IPaginationMeta>) => {
                if (lastMessage.getTime() >= Date.now()) {
                    this.cacheMessages(room.roomAddress, messages.items);
                }

                return messages.items;
            }),
        );
    }
}
