import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MemberEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    image: string;

    @Column({ default: false })
    hasAccessory: boolean;

    @Column()
    role: string;

    //Add custom roles

    @CreateDateColumn()
    joined: Date;
}