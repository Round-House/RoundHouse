import { UserAuth } from "src/auth/models/userAuth.interface";
import { Message } from "src/message/models/message.interface";
import { Room } from "src/room/models/room.interface";
import { Stream } from "src/stream/models/stream.interface";

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

    //Rooms
    roomOwner: Room[];
    roomMod: Room[];
    roomMember: Room[];

    //Misc
    link: string;
    isCat: boolean;
    joined: Date; 
}
