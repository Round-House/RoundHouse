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
} from 'typeorm';

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

    @Column()
    stream: Stream;

    //Rooms
    @OneToMany(() => RoomEntity, (room) => room.Owner)
    roomOwner: Room[];

    @ManyToMany(() => RoomEntity)
    @JoinTable()
    roomMod: Room[];

    @ManyToMany(() => RoomEntity)
    @JoinTable()
    roomUser: Room[];

    //Misc
    @Column()
    links: string[];

    @Column({ default: false })
    cat: boolean;

    @CreateDateColumn()
    joined: Date;

    //Logic
    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}
