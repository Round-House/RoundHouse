import { User } from "src/user/models/user.interface";

export interface LocalMember {
    id: number;
    user: User;
    name: string;
    role: string;
    joined: Date;
}