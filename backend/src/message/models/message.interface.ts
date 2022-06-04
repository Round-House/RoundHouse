import { Stream } from "src/stream/models/stream.interface";
import { User } from "src/user/models/user.interface";

export interface Message {
    id: number;
    text: string;
    account: User;
    stream: Stream;
    createdAt: Date;
    updatedAt?: Date;
}
