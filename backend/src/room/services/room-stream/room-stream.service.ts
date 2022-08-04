import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { RoomEntity } from 'src/room/models/room.entity';
import { Room } from 'src/room/models/room.interface';
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

    getStream(id: number, relations: string[]): Observable<Stream> {
        return from(
            this.streamRepository.findOneOrFail({
                where: { id },
                relations: relations,
            }),
        ).pipe(
            map((stream: Stream) => {
                return stream;
            }),
        );
    }

    createMessage(
        room: Room,
        stream: Stream,
        user: User,
        message: string,
    ): Observable<Message> {
        const newMessage = new MessageEntity();
        newMessage.text = message;
        newMessage.comments = new StreamEntity();
        newMessage.account = user;

        return from(this.messageRepository.save(newMessage)).pipe(
            switchMap((message: Message) => {
                stream.messages.push(message);

                return from(this.streamRepository.save(stream)).pipe(
                    map(() => {
                        // Store message in cache of room address
                        this.cache.lpush(
                            'room:' + room.roomAddress + ':messages',
                            JSON.stringify(message),
                        );
                        this.cache.ltrim(
                            'room:' + room.roomAddress + ':messages',
                            0,
                            19,
                        );
                        this.cache.expire(
                            'room:' + room.roomAddress + ':messages',
                            1200,
                        );

                        return message;
                    }),
                    catchError((err) => throwError(() => err)),
                );
            }),
        );
    }

    readStream(
        room: Room,
        stream: Stream,
        options: IPaginationOptions,
        lastMessage: Date,
    ): Observable<any> {
        {
            const deliverable = new StreamDeliverableDto();
            deliverable.stream = stream;

            lastMessage.getTime() >= Date.now();

            var hasCache: string;

            this.cache.get(
                'room:' + room.roomAddress + ':messages',
                (error, cb) => {
                    hasCache = cb;
                },
            );

            if (hasCache) {
                const cacheMessages = this.getMessageCache(room.roomAddress);
                if (cacheMessages instanceof Error) {
                    // Get messages from postgres instead
                    throw cacheMessages;
                }
                //deliverable.messages =
                cacheMessages;

                console.log(deliverable);
                //return deliverable;
            } else {
                //use private method to get messages from postgres
                return this.getMessagePostgres(options, lastMessage, stream);
            }
        }
    }

    private getMessageCache(roomAddress: string): Message[] | Error {
        this.cache.lrange(
            'room:' + roomAddress + ':messages',
            0,
            19,
            (error, cacheMessages) => {
                if (error) {
                    throw error;
                }
                return cacheMessages.map((message) => {
                    const messageObject: Message[] = JSON.parse(message);
                    return messageObject;
                });
            },
        );
        return new Error('Cache not found.');
    }

    private getMessagePostgres(
        options: IPaginationOptions,
        lastMessage: Date,
        stream: Stream,
    ): Observable<Message[]> {
        return from(
            paginate<Message>(this.messageRepository, options, {
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
            map((messages: Pagination<Message, IPaginationMeta>) => {
                return messages.items;
            }),
        );
    }
}
