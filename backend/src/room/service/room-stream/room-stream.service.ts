import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { RoomEntity } from 'src/room/models/room.entity';
import { Room } from 'src/room/models/room.interface';
import { CreateMessageDto } from 'src/stream/message/models';
import { MessageEntity } from 'src/stream/message/models/message.entity';
import { Message } from 'src/stream/message/models/message.interface';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { Stream } from 'src/stream/models/stream.interface';
import { UserEntity } from 'src/user/models/user.entity';
import { User } from 'src/user/models/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RoomStreamService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(StreamEntity)
        private readonly streamRepository: Repository<StreamEntity>,
        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>,
    ) {}

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

    getStream(roomAddress: string, user: any): Observable<Stream> {
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
                            return from(
                                this.streamRepository.findOneOrFail({
                                    where: { id: room.stream.id },
                                    relations: {
                                        messages: true,
                                    },
                                }),
                            ).pipe(
                                map((stream: Stream) => {
                                    return stream;
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
