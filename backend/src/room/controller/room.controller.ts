import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { catchError, map, Observable, of } from 'rxjs';
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

    @Get('/userSearch')
    getRoomsOfUser(@Query('username') username: string): Observable<Room[]> {
        return this.roomService.getRoomsOfUser(username);
    }

    @Post('/create')
    @UseGuards(AuthGuard('jwt'))
    createRoom(
        @Body() room: CreateRoomDto,
        @Request() req: any,
    ): Observable<Room | Object> {
        return this.roomService.createRoom(room, req.user.user).pipe(
            map((newRoom: Room) => {return newRoom}),
            catchError((err) => of({ error: err.message })),
        )
    }
}
