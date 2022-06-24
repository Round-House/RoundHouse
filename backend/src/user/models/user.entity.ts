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
    JoinTable,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import "reflect-metadata"
import { StreamEntity } from 'src/stream/models/stream.entity';

@Entity()
export class UserEntity {
    //Basic Info
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column({ nullable: true })
    nickname: string;

    @Column()
    password: string;

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

    @ManyToMany(() => RoomEntity)
    @JoinTable()
    roomMod: Room[];

    @ManyToMany(() => RoomEntity)
    @JoinTable()
    roomMember: Room[];

    //Misc
    @Column({nullable: true})
    link: string;

    @Column({ default: false })
    isCat: boolean;

    @CreateDateColumn()
    joined: Date;

    //Logic
    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}
