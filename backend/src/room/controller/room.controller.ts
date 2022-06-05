import { Body, Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateRoomDto } from '../models/create-room.dto';
import { Room } from '../models/room.interface';
import { RoomService } from '../service/room.service';

@Controller('rooms')
export class RoomController {
    constructor(private roomService: RoomService) {}

    @Get()
    findAll(): Observable<Room[]> {
        return this.roomService.findAll();
    }

    @Post('/create')
    createRoom(@Body() room: CreateRoomDto): Observable<Room> {
        return this.roomService.createRoom(room);
    }
}
