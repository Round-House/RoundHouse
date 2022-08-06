import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessageEntity } from '../message/models/message.entity';

@Entity()
export class StreamEntity {
    //Basic Info
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => MessageEntity, (message) => message.stream)
    messages: MessageEntity[];
}
