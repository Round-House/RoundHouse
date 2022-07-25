import { IsOptional } from 'class-validator';
import { Room } from './room.interface';

export class TreeRoomDto {
    id: number;
    name: string;
    roomAddress: string;
    color: string;

    @IsOptional()
    image: string;

    constructor(room: Room) {
        this.id = room.id;
        this.name = room.name;
        this.roomAddress = room.roomAddress;
        this.color = room.color;
        if (room.image) {
            this.image = room.image;
        }
    }
}
