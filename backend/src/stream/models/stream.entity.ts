import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessageEntity } from '../message/models/message.entity';
import { Message } from '../message/models/message.interface';

@Entity()
export class StreamEntity {
    //Basic Info
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => MessageEntity, (message) => message.stream)
    messages: Message[];
}
