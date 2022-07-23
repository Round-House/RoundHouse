import { UserAuth } from 'src/auth/models/userAuth.interface';
import { Message } from 'src/stream/message/models/message.interface';
import { Stream } from 'src/stream/models/stream.interface';
import { Member } from 'src/room/member/models/member.interface';
import { ExternalMembership } from 'src/room/member/models/external-membership.interface';

export interface User {
    //Basic Information
    id: number;
    username: string;
    nickname?: string;
    auth: UserAuth;

    //Images
    image?: string;
    banner?: string;

    //Messages
    messages: Message[];
    stream: Stream;

    //Room Memberships
    memberships: Member[];
    externalMemberships: ExternalMembership[];

    //Misc
    link: string;
    hasAccessory: boolean;
    joined: Date;
    color: string;
}

export enum UserRole {
    ADMIN = 'admin',
    CO_ADMIN = 'co-admin',
    SERVER_MODERATOR = 'server moderator',
    USER = 'user',
    EXTERNAL = 'external',
}
