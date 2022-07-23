import { UserEntity } from 'src/user/models/user.entity';
import { User } from 'src/user/models/user.interface';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExternalMembershipEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.memberships)
    user: User;

    // Temporary assumed values until Activity Pub is implemented
    @Column()
    server: string;

    @Column()
    room: string;
}
