import { RoomEntity } from 'src/room/models/room.entity';
import { UserEntity } from 'src/user/models/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { MemberRole } from './member.interface';

@Entity()
export class MemberEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.memberships)
    user: Relation<UserEntity>;

    @ManyToOne(() => RoomEntity, (room) => room.memberships)
    room: Relation<RoomEntity>;

    @Column({ type: 'enum', enum: MemberRole, default: MemberRole.USER })
    role: MemberRole;

    //TODO: Add custom roles

    @CreateDateColumn()
    joined: Date;
}
