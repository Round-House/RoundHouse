import { UserEntity } from "src/user/models/user.entity";
import { User } from "src/user/models/user.interface";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

Entity()
export class RemoteMemberEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => UserEntity, (user) => user.remoteMemberships)
    user: User;

    @Column()
    roomAddress: string;
}