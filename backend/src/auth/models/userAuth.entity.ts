import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserAuthEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    passwordHash: string;

    //Logic
    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}