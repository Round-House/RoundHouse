import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { MessageEntity } from '../models/message.entity';
import { Message } from '../models/message.interface';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageEntity)
        private readonly streamRepository: Repository<MessageEntity>,) {}

        findAll(): Observable<Message[]> {
            return from(this.streamRepository.find());
        }
}
