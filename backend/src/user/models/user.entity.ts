import { MessageEntity } from 'src/stream/message/models/message.entity';
import { Message } from 'src/stream/message/models/message.interface';
import { Stream } from 'src/stream/models/stream.interface';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import "reflect-metadata"
import { StreamEntity } from 'src/stream/models/stream.entity';
import { UserAuth } from 'src/auth/models/userAuth.interface';
import { UserAuthEntity } from 'src/auth/models/userAuth.entity';
import { MemberEntity } from 'src/room/member/models/member.entity';
import { Member } from 'src/room/member/models/member.interface';
import { ExternalMembershipEntity } from 'src/room/member/models/external-membership.entity';
import { ExternalMembership } from 'src/room/member/models/external-membership.interface';
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

    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    role: UserRole;

    @OneToOne(() => UserAuthEntity, {cascade: true})
    @JoinColumn()
    auth: UserAuth;

    //Images
    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    banner: string;

    //Messages
    @OneToMany(() => MessageEntity, (message) => message.account)
    messages: Message[];

    @OneToOne(() => StreamEntity, {cascade: true})
    @JoinColumn()
    stream: Stream;

    //Room Memberships
    @OneToMany(() => MemberEntity, (member) => member.user)
    memberships: Member[];

    @OneToMany(() => ExternalMembershipEntity, (member) => member.user)
    externalMemberships: ExternalMembership[];

    //Misc
    @Column({nullable: true})
    link: string;

    @Column({ default: false })
    hasAccessory: boolean;

    @CreateDateColumn()
    joined: Date;

    @Column({ default: '41345f', nullable: true })
    color: string;
}
