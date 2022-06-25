import { MessageEntity } from 'src/message/models/message.entity';
import { Message } from 'src/message/models/message.interface';
import { RoomEntity } from 'src/room/models/room.entity';
import { Room } from 'src/room/models/room.interface';
import { Stream } from 'src/stream/models/stream.interface';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    OneToMany,
    CreateDateColumn,
    ManyToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import "reflect-metadata"
import { StreamEntity } from 'src/stream/models/stream.entity';
import { UserAuth } from 'src/auth/models/userAuth.interface';
import { UserAuthEntity } from 'src/auth/models/userAuth.entity';

@Entity()
export class UserEntity {
    //Basic Info
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ nullable: true })
    nickname: string;

    @OneToOne(() => UserAuthEntity, {cascade: true})
    @JoinColumn()
    auth: UserAuth;

    //Images
    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    banner: string;

    //Messages
    @OneToMany(() => MessageEntity, (message) => message.account)
    messages: Message[];

    @OneToOne(() => StreamEntity, {cascade: true})
    @JoinColumn()
    stream: Stream;

    //Rooms
    @OneToMany(() => RoomEntity, (room) => room.owner)
    roomOwner: Room[];

    @ManyToMany(() => RoomEntity, room => room.moderators)
    roomMod: Room[];

    @ManyToMany(() => RoomEntity, room => room.members)
    roomMember: Room[];

    //Misc
    @Column({nullable: true})
    link: string;

    @Column({ default: false })
    isCat: boolean;

    @CreateDateColumn()
    joined: Date;
}
