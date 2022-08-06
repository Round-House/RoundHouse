import { MessageEntity } from 'src/stream/message/models/message.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import 'reflect-metadata';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { UserAuthEntity } from 'src/auth/models/userAuth.entity';
import { MemberEntity } from 'src/room/member/models/member.entity';
import { ExternalMembershipEntity } from 'src/room/member/models/external-membership.entity';
import { UserRole } from './user.interface';

@Entity()
export class UserEntity {
    //Basic Info
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ nullable: true })
    nickname: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @OneToOne(() => UserAuthEntity, { cascade: true })
    @JoinColumn()
    auth: UserAuthEntity;

    //Images
    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    banner: string;

    //Messages
    @OneToMany(() => MessageEntity, (message) => message.account)
    messages: MessageEntity[];

    @OneToOne(() => StreamEntity, { cascade: true })
    @JoinColumn()
    stream: StreamEntity;

    //Room Memberships
    @OneToMany(() => MemberEntity, (member) => member.user)
    memberships: MemberEntity[];

    @OneToMany(() => ExternalMembershipEntity, (member) => member.user)
    externalMemberships: ExternalMembershipEntity[];

    //Misc
    @Column({ nullable: true })
    link: string;

    @Column({ default: false })
    hasAccessory: boolean;

    @CreateDateColumn()
    joined: Date;

    @Column({ default: '#41345f' })
    color: string;
}
