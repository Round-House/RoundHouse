import { User } from "src/user/models/user.interface";

export interface Member {
    id: number;
    user: User;
    role: MemberRole;
    joined: Date;
}

export enum MemberRole {
    OWNER = 'owner',  
    MODERATOR = 'moderator',
    USER = 'user'
}