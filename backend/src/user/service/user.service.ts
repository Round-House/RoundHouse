import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { User } from '../models/user.interface';
import { CreateMessageDto } from 'src/message/models';
import { Message } from 'src/message/models/message.interface';
import { MessageEntity } from 'src/message/models/message.entity';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { Stream } from 'src/stream/models/stream.interface';
import { UserJwtDto } from 'src/auth/models';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>,
        @InjectRepository(StreamEntity)
        private readonly streamRepository: Repository<StreamEntity>,
    ) {}

    findAll(): Observable<User[]> {
        return from(this.userRepository.find());
    }

    getStreamMessages(username: string): Observable<Stream | any> {
        return from(
            this.userRepository.findOneOrFail({
                where: { username: username },
                relations: {
                    stream: true,
                },
            }),
        ).pipe(
            switchMap((user: User) => {
                return from(
                    this.streamRepository.findOneOrFail({
                        where: { id: user.stream.id },
                        relations: {
                            messages: true,
                        },
                    }),
                ).pipe(
                    map((stream: Stream) => {
                        return stream.messages;
                    }),
                );
            }),
            catchError((err) => throwError(() => err)),
        );
    }

    writeToStream(
        message: CreateMessageDto,
        user: UserJwtDto,
    ): Observable<Message | any> {
        const newMessage = new MessageEntity();
        newMessage.text = message.text;
        //TODO: Does this need to be saved?
        newMessage.comments = new StreamEntity();
        newMessage.comments.messages = [];

        return from(
            this.userRepository.findOneOrFail({
                where: { username: user.username },
                relations: {
                    stream: true,
                },
            }),
        ).pipe(
            switchMap((author: User) => {
                newMessage.account = author;

                return from(
                    this.streamRepository.findOneOrFail({
                        where: { id: author.stream.id },
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
                                    this.streamRepository.save(stream),
                                ).pipe(
                                    map((stream: Stream) => {
                                        return stream;
                                    }),
                                    catchError((err) => throwError(() => err)),
                                );
                            }),
                        );
                    }),
                    catchError((err) => throwError(() => err)),
                );
            }),
            catchError((err) => throwError(() => err)),
        );
    }
}
