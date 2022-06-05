import { Stream } from "src/stream/models/stream.interface";
import { User } from "src/user/models/user.interface";

export interface Room {
    //Basic Info
    id: number;
    name: string;
    description?: string;
    createdAt: Date;

    //Images
    image?: string;
    banner?: string;

    //Room Tree
    parentRoom?: Room;
    childRooms: Room[];

    //Users
    Owner: User;
    Moderator: User[];
    user: User[];

    //Messages
    stream: Stream;

}
