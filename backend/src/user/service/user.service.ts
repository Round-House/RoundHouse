import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { User } from '../models/user.interface';
import { CreateMessageDto } from 'src/stream/message/models';
import { Message } from 'src/stream/message/models/message.interface';
import { MessageEntity } from 'src/stream/message/models/message.entity';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { Stream } from 'src/stream/models/stream.interface';
import { UserJwtDto } from 'src/auth/models';
import {
    Pagination,
    IPaginationOptions,
    paginate,
    IPaginationMeta,
} from 'nestjs-typeorm-paginate';
import { StreamDeliverableDto } from 'src/stream/models';

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

    findAll(options: IPaginationOptions): Observable<Pagination<User>> {
        return from(
            paginate<User>(this.userRepository, options, {
                relations: ['memberships', 'memberships.room', 'stream', 'stream.messages'],
            }),
        ).pipe(map((users: Pagination<User>) => users));
    }

    getStreamMessages(username: string, options: IPaginationOptions): Observable<Stream | any> {
        return from(
            this.userRepository.findOneOrFail({
                where: { username: username },
                relations: {
                    stream: true,
                },
            }),
        ).pipe(
            switchMap((user: User) => {
                const deliverable = new StreamDeliverableDto();
                deliverable.stream = user.stream;
                
                return from(paginate<Message>(this.messageRepository, options, {
                    relations: ['account', 'comments'],
                    where: { stream: user.stream },
                }),).pipe(
                    map((messages: Pagination<Message, IPaginationMeta>) => {
                        deliverable.messages = messages;
                        return deliverable;
                    }),);
            }),
        );
    }

    writeToStream(
        message: CreateMessageDto,
        user: UserJwtDto,
    ): Observable<Message | any> {
        const newMessage = new MessageEntity();
        newMessage.text = message.text;
        newMessage.comments = new StreamEntity();

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
                                    map(() => {
                                        return message;
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
