import { User } from 'src/user/models/user.interface';
import { UserEntity } from 'src/user/models/user.entity';
import { Room } from './room.interface';
import { Stream } from 'src/stream/models/stream.interface';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';

@Entity()
export class RoomEntity {
    //Basic Info
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    //Images
    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    banner: string;

    //Room Tree
    @Column()
    roomAddress: string;

    @ManyToOne(() => RoomEntity, (room) => room.childRooms, { nullable: true })
    parentRoom: Room;

    @OneToMany(() => RoomEntity, (room) => room.parentRoom)
    childRooms: Room[];

    //Users
    @ManyToOne(() => UserEntity, (user) => user.roomOwner)
    Owner: User;

    @ManyToMany(() => UserEntity)
    @JoinTable()
    Moderator: User[];

    @ManyToMany(() => UserEntity)
    @JoinTable()
    user: User[];

    //Messages
    @Column({type: 'json'})
    stream: Stream;

    //Logic
    @BeforeInsert()
    checkParentExists() {}

    @BeforeInsert()
    checkRelativeName(){}
}
