import { RoomEntity } from "src/room/models/room.entity";
import { Room } from "src/room/models/room.interface";
import { UserEntity } from "src/user/models/user.entity";
import { User } from "src/user/models/user.interface";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { MemberRole } from "./member.interface";

@Entity()
export class MemberEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => UserEntity, (user) => user.memberships)
    user: Relation<User>;

    @ManyToOne(() => RoomEntity, (room) => room.memberships)
    room: Relation<Room>;

    @Column({type: 'enum', enum: MemberRole, default: MemberRole.USER})
    role: MemberRole;

    //TODO: Add custom roles

    @CreateDateColumn()
    joined: Date;
}