import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { UserRole } from '../models/user.interface';
import { MessageEntity } from 'src/stream/message/models/message.entity';
import { StreamEntity } from 'src/stream/models/stream.entity';
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

    findAll(options: IPaginationOptions): Observable<Pagination<UserEntity>> {
        return from(
            paginate<UserEntity>(this.userRepository, options, {
                relations: [
                    'memberships',
                    'memberships.room',
                    'stream',
                    'stream.messages',
                ],
            }),
        ).pipe(map((users: Pagination<UserEntity>) => users));
    }

    findOne(username: string, relations: string[]): Observable<UserEntity> {
        return from(
            this.userRepository.findOne({
                where: { username },
                relations: relations,
            }),
        ).pipe(
            map((user: UserEntity) => {
                return user;
            }),
        );
    }

    getAdmin(): Observable<UserEntity | any> {
        return from(
            this.userRepository.findOneOrFail({
                where: { role: UserRole.ADMIN },
            }),
        ).pipe(
            map((admin: UserEntity) => {
                return admin;
            }),
            catchError((err) => throwError(() => err)),
        );
    }

    checkUsernameTaken(username: string): Observable<boolean> {
        return from(
            this.userRepository.findOne({
                where: { username },
            }),
        ).pipe(
            map((user: UserEntity) => {
                return user ? true : false;
            }),
            catchError((err) => throwError(() => err)),
        );
    }

    getStreamMessages(
        user: UserEntity,
        options: IPaginationOptions,
    ): Observable<StreamEntity | any> {
        const deliverable = new StreamDeliverableDto();
        deliverable.stream = user.stream;

        return from(
            paginate<MessageEntity>(this.messageRepository, options, {
                relations: ['account', 'comments'],
                where: { stream: user.stream },
            }),
        ).pipe(
            map((messages: Pagination<MessageEntity, IPaginationMeta>) => {
                deliverable.messages = messages.items;
                return deliverable;
            }),
        );
    }

    writeToStream(
        message: string,
        user: UserEntity,
        stream: StreamEntity,
    ): Observable<MessageEntity | any> {
        const newMessage = new MessageEntity();
        newMessage.text = message;
        newMessage.comments = new StreamEntity();
        newMessage.account = user;

        return from(this.messageRepository.save(newMessage)).pipe(
            switchMap((message: MessageEntity) => {
                stream.messages.push(message);

                return from(this.streamRepository.save(stream)).pipe(
                    map(() => {
                        return message;
                    }),
                    catchError((err) => throwError(() => err)),
                );
            }),
        );
    }
}
