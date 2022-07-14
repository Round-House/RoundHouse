import { Room } from './room.interface';
import { Stream } from 'src/stream/models/stream.interface';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    Relation,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { MemberEntity } from '../member/models/member.entity';
import { Member } from '../member/models/member.interface';

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

    //Cosmentics
    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    banner: string;

    @Column({ default: '#41345f'})
    color: string;

    //Room Tree
    @Column()
    roomAddress: string;

    @ManyToOne(() => RoomEntity, (room) => room.childRooms, { nullable: true })
    parentRoom: Relation<Room>;

    @OneToMany(() => RoomEntity, (room) => room.parentRoom)
    childRooms: Relation<Room>[];

    //Messages
    @OneToOne(() => StreamEntity, { cascade: true })
    @JoinColumn()
    stream: Stream;

    //User Memberships
    @OneToMany(() => MemberEntity, (member) => member.room)
    memberships: Relation<Member>[];
}
