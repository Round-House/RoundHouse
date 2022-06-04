import { Message } from "src/message/models/message.interface";
import { Room } from "src/room/models/room.interface";
import { Stream } from "src/stream/models/stream.interface";

export interface User {
    //Basic Information
    id: number;
    email: string;
    username: string;
    nickname?: string;
    password: string;

    //Images
    image?: string;
    banner?: string;

    //Messages
    messages: Message[];
    stream: Stream;

    //Rooms
    roomOwner: Room[];
    roomMod: Room[];
    roomUser: Room[];

    //Misc
    links: string[];
    cat: boolean;
    joined: Date; 
}
