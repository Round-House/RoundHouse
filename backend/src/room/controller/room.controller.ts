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
import { User } from 'src/user/models/user.interface';
import { Member } from '../member/models/member.interface';
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

    @Post('/join')
    @UseGuards(AuthGuard('jwt'))
    joinRoom(
        @Query('roomAddress') roomAddress: string,
        @Request() req: any,
    ): Observable<User | Object> {
        return this.roomService.joinRoom(roomAddress, req.user.user).pipe(
            map((user: User) => {return user}),
            catchError((err) => of({ error: err.message })),
        )
    }

    @Post('/leave')
    @UseGuards(AuthGuard('jwt'))
    leaveRoom(
        @Query('roomAddress') roomAddress: string,
        @Request() req: any,
    ): Observable<Room | Object> {
        return this.roomService.leaveRoom(roomAddress, req.user.user).pipe(
            map((newRoom: Room) => {return newRoom}),
            catchError((err) => of({ error: err.message })),
        )
    }
}
