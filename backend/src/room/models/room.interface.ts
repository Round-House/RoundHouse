import { Stream } from "src/stream/models/stream.interface";
import { Member } from "../member/models/member.interface";

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
    roomAddress: string;
    parentRoom?: Room;
    childRooms: Room[];

    //User Memberships
    memberships: Member[];

    //Messages
    stream: Stream;

}
