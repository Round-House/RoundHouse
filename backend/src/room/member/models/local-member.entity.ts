import { UserEntity } from "src/user/models/user.entity";
import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

Entity()
export class LocalMemberEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => UserEntity, (user) => user.member)
    user: UserEntity;
}