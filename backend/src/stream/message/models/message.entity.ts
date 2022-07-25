import { UserEntity } from 'src/user/models/user.entity';
import { User } from 'src/user/models/user.interface';
import { StreamEntity } from '../../models/stream.entity';
import { Stream } from 'src/stream/models/stream.interface';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToOne,
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

    @OneToOne(() => StreamEntity, { cascade: true })
    @JoinColumn()
    comments: Stream;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
