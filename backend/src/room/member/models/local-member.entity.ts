import { UserEntity } from "src/user/models/user.entity";
import { User } from "src/user/models/user.interface";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

Entity()
export class LocalMemberEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => UserEntity, (user) => user.localMemberships)
    user: User;

    @Column()
    name: string;

    @Column()
    role: string;

    //TODO: Add custom roles

    @CreateDateColumn()
    joined: Date;
}