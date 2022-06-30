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
import { CreateMessageDto } from 'src/stream/message/models';
import { Message } from 'src/stream/message/models/message.interface';
import { Stream } from 'src/stream/models/stream.interface';
import { User } from 'src/user/models/user.interface';
import { Member } from '../member/models/member.interface';
import { CreateRoomDto } from '../models/create-room.dto';
import { Room } from '../models/room.interface';
import { RoomCrudService } from '../service/room-crud/room-crud.service';
import { RoomMembershipService } from '../service/room-membership/room-membership.service';
import { RoomStreamService } from '../service/room-stream/room-stream.service';

@Controller('rooms')
export class RoomController {
    constructor(private roomCrudService: RoomCrudService,
        private roomMembershipService: RoomMembershipService,
        private roomStreamService: RoomStreamService,) {}

    @Get()
    findAll(): Observable<Room[]> {
        return this.roomCrudService.findAll();
    }

    @Get('/userSearch')
    getMebershipsOfUser(@Query('username') username: string): Observable<Member[]> {
        return this.roomMembershipService.getMebershipsOfUser(username);
    }

    @Post('/create')
    @UseGuards(AuthGuard('jwt'))
    createRoom(
        @Body() room: CreateRoomDto,
        @Request() req: any,
    ): Observable<Room | Object> {
        return this.roomCrudService.createRoom(room, req.user.user).pipe(
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
        return this.roomMembershipService.joinRoom(roomAddress, req.user.user).pipe(
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
        return this.roomMembershipService.leaveRoom(roomAddress, req.user.user).pipe(
            map((newRoom: Room) => {return newRoom}),
            catchError((err) => of({ error: err.message })),
        )
    }

    @Post('/stream/createMessage')
    @UseGuards(AuthGuard('jwt'))
    createMessage(
        @Query('roomAddress') roomAddress: string,
        @Body() message: CreateMessageDto,
        @Request() req: any,
    ): Observable<Message | Object> {
        return this.roomStreamService.createMessage(roomAddress, message, req.user.user).pipe(
            map((newMessage: Message) => {return newMessage}),
            catchError((err) => of({ error: err.message })),
        )
    }

    @Get('/stream/messages')
    @UseGuards(AuthGuard('jwt'))
    getStream(
        @Query('roomAddress') roomAddress: string,
        @Request() req: any,
    ): Observable<Stream | Object> {
        return this.roomStreamService.getStream(roomAddress, req.user.user).pipe(
            map((stream: Stream) => {return stream}),
            catchError((err) => of({ error: err.message })),
        );
    }
}
