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

    getStream(username: string): Observable<Stream | any> {
        return from(
            this.userRepository.findOneOrFail({
                where: { username: username },
            }),
        ).pipe(
            switchMap((user: User) => {
                console.log(user.id);

                return from(
                    this.userRepository
                        .createQueryBuilder('user')
                        .where('user.id = :id', { id: user.id })
                        .leftJoinAndSelect('user.stream', 'stream')
                        .getOne(),
                ).pipe(
                    map((userInfo: User) => {
                        console.log(userInfo.stream.id);

                        return from(
                            this.messageRepository
                                .createQueryBuilder('message')
                                .leftJoinAndSelect('message.stream', 'stream')
                                .where('steam.id = :id', {
                                    id: userInfo.stream.id,
                                })
                                .getMany(),
                        );
                    }),
                );
            }),
            catchError((err) => throwError(() => err)),
        );
    }

    writeToStream(
        message: CreateMessageDto,
        user: User,
    ): Observable<Message | any> {
        const newMessage = new MessageEntity();
        newMessage.text = message.text;
        newMessage.comments = new StreamEntity();
        newMessage.comments.messages = [];

        return from(
            this.userRepository.findOneOrFail({
                where: { username: user.username },
            }),
        ).pipe(
            switchMap((author: User) => {
                newMessage.account = author;

                return from(this.messageRepository.save(newMessage)).pipe(
                    map((messageResponce: Message) => {
                        return messageResponce;
                    }),
                    catchError((err) => throwError(() => err)),
                );
            }),
            catchError((err) => throwError(() => err)),
        );
    }
}
