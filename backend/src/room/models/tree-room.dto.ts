import { IsOptional } from 'class-validator';
import { Room } from './room.interface';

export class TreeRoomDto {
    id: number;
    name: string;
    handle: string;
    roomAddress: string;
    color: string;

    @IsOptional()
    image: string;

    constructor(room: Room) {
        this.id = room.id;
        this.name = room.name;
        this.handle = room.handle;
        this.roomAddress = room.roomAddress;
        this.color = room.color;
        if (room.image) {
            this.image = room.image;
        }
    }
}
