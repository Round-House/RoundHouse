export class RoomDto{
    id?: number;
    createdAt?: Date;
    name?: string;
    description?: string;
    image?: string;
    banner?: string;
    color?: string;
    roomAddress?: string;
    parentRoom?: RoomDto;
    childRooms?: RoomDto[];
}
