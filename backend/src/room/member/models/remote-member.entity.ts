import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

Entity()
export class RemoteMemberEntity {
    //Basic Info
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    serverAddress: string;
}