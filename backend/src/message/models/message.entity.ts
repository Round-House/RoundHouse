import { UserEntity } from 'src/user/models/user.entity';
import { User } from 'src/user/models/user.interface';
import { StreamEntity } from '../../stream/models/stream.entity';
import { Stream } from 'src/stream/models/stream.interface';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @ManyToOne(() => UserEntity, (user) => user.messages)
    account: User;

    @ManyToOne(() => StreamEntity, (stream) => stream.messages)
    stream: Stream;

    @Column({type: 'json'})
    comments: Stream;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
