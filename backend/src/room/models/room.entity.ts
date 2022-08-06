import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
    Relation,
    OneToOne,
    JoinColumn,
    Tree,
    TreeParent,
    TreeChildren,
} from 'typeorm';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { MemberEntity } from '../member/models/member.entity';

@Entity()
@Tree('materialized-path')
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

    @Column({ default: '#41345f' })
    color: string;

    //Room Tree
    @Column()
    roomAddress: string;

    @Column()
    handle: string;

    @TreeParent()
    parentRoom: Relation<RoomEntity>;

    @TreeChildren()
    childRooms: Relation<RoomEntity>[];

    //Messages
    @OneToOne(() => StreamEntity, { cascade: true })
    @JoinColumn()
    stream: StreamEntity;

    //User Memberships
    @OneToMany(() => MemberEntity, (member) => member.room)
    memberships: Relation<MemberEntity>[];
}
