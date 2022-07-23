import { User } from 'src/user/models/user.interface';

export interface ExternalMembership {
    id: number;
    user: User;
    server: string;
    room: string;
}
