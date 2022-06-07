import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
    @UseGuards(AuthGuard('jwt'))
    createRoom(@Body() room: CreateRoomDto, @Request() req: any): Observable<Room> {
        return this.roomService.createRoom(room, req.user);
    }
}
