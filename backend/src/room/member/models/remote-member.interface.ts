import { User } from "src/user/models/user.interface";

export interface RemoteMember {
    id: number;
    user: User;
    roomAddress: string;
}