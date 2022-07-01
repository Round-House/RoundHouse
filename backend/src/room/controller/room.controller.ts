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
import { RoomCrudService } from '../services/room-crud/room-crud.service';
import { RoomMembershipService } from '../services/room-membership/room-membership.service';
import { RoomStreamService } from '../services/room-stream/room-stream.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { StreamDeliverableDto } from 'src/stream/models';

export const ROOM_ENTRIES_URL ='http://localhost:3000/api/rooms';
@Controller('rooms')
export class RoomController {
    constructor(private roomCrudService: RoomCrudService,
        private roomMembershipService: RoomMembershipService,
        private roomStreamService: RoomStreamService,) {}

    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Observable<Pagination<Room>> {
        limit = limit > 100 ? 100 : limit;
        return this.roomCrudService.findAll({
            limit: Number(limit),
            page: Number(page),
            route: ROOM_ENTRIES_URL});
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
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Request() req: any,
    ): Observable<StreamDeliverableDto | Object> {
        return this.roomStreamService.getStream(roomAddress, req.user.user, {limit: Number(limit),
            page: Number(page),
            route: ROOM_ENTRIES_URL + '/stream/messages?roomAddress=' + roomAddress}).pipe(
            map((stream: StreamDeliverableDto) => {return stream}),
            catchError((err) => of({ error: err.message })),
        );
    }
}
