import { User } from 'src/user/models/user.interface';
import { UserEntity } from 'src/user/models/user.entity';
import { Room } from './room.interface';
import { Stream } from 'src/stream/models/stream.interface';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    Relation,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { StreamEntity } from 'src/stream/models/stream.entity';

@Entity()
export class RoomEntity {
    //Basic Info
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    //Images
    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    banner: string;

    //Room Tree
    @Column()
    roomAddress: string;

    @ManyToOne(() => RoomEntity, (room) => room.childRooms, { nullable: true })
    parentRoom: Relation<Room>;

    @OneToMany(() => RoomEntity, (room) => room.parentRoom)
    childRooms: Relation<Room>[];

    //Messages
    @OneToOne(() => StreamEntity, {cascade: true})
    @JoinColumn()
    stream: Stream;

    //Users
    @ManyToOne(() => UserEntity, (user) => user.roomOwner)
    owner: User;

    @ManyToMany(() => UserEntity)
    @JoinTable()
    moderators: User[];

    @ManyToMany(() => UserEntity)
    @JoinTable()
    members: User[];
}
