import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { Message } from 'src/stream/message/models/message.interface';
import { User } from 'src/user/models/user.interface';
import { Member } from '../member/models/member.interface';
import { CreateRoomDto } from '../models/create-room.dto';
import { Room } from '../models/room.interface';
import { RoomCrudService } from '../services/room-crud/room-crud.service';
import { RoomMembershipService } from '../services/room-membership/room-membership.service';
import { RoomStreamService } from '../services/room-stream/room-stream.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { StreamDeliverableDto } from 'src/stream/models';
import { TreeRoomDto } from '../models';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FindUserInterceptor } from 'src/user/interceptors/find-user.interceptor';
import { Stream } from 'src/stream/models/stream.interface';
import { GetRoomInterceptor } from '../interceptors/get-room.interceptor';
import { GetRoomStreamInterceptor } from '../interceptors/get-room-stream.interceptor';
import { SetStreamMessageParamInterceptor } from '../interceptors/set-stream-msg-param.interceptor';

export const ROOM_ENTRIES_URL = 'http://localhost:3000/api/rooms';
@Controller('rooms')
export class RoomController {
    constructor(
        private roomCrudService: RoomCrudService,
        private roomMembershipService: RoomMembershipService,
        private roomStreamService: RoomStreamService,
    ) {}

    @Get('/get')
    getRoom(
        @Query('roomAddress') roomAddress: string,
    ): Observable<Room | Object> {
        return this.roomCrudService.getRoom(roomAddress, []);
    }

    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Observable<Pagination<Room>> {
        limit = limit > 100 ? 100 : limit;
        return this.roomCrudService.findAll({
            limit: Number(limit),
            page: Number(page),
            route: ROOM_ENTRIES_URL,
        });
    }

    @Get('/members')
    @UseInterceptors(GetRoomInterceptor)
    membersInRoom(
        @Body('room') room: Room,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Observable<Pagination<Member>> {
        limit = limit > 100 ? 100 : limit;
        return this.roomMembershipService.membersInRoom(room, {
            limit: Number(limit),
            page: Number(page),
            route:
                ROOM_ENTRIES_URL + '/members?roomAddress=' + room.roomAddress,
        });
    }

    @Get('/rootRooms')
    @UseGuards(JwtAuthGuard)
    getRootRooms(@Request() req: any): Observable<TreeRoomDto[]> {
        return this.roomMembershipService.getRootRooms(req.user.user.username);
    }

    @Get('/subRooms')
    getSubRooms(@Query('roomAddress') address: string): Observable<Room> {
        return this.roomMembershipService.getSubRooms(address).pipe(
            map((rooms: any) => {
                return rooms;
            }),
            catchError((err) => of({ error: err.message })),
        );
    }

    @Get('/usersSubRooms')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FindUserInterceptor, GetRoomInterceptor)
    getUsersSubRooms(
        @Request() req: any,
        @Query('roomAddress') address: string,
    ): Observable<TreeRoomDto[]> {
        return this.roomMembershipService
            .getUsersSubRooms(req.user.user.username, address)
            .pipe(
                map((rooms: any) => {
                    return rooms;
                }),
                catchError((err) => of({ error: err.message })),
            );
    }

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    createRoom(
        @Body() room: CreateRoomDto,
        @Request() req: any,
    ): Observable<Room | Object> {
        return this.roomCrudService.createRoom(room, req.user.user).pipe(
            map((newRoom: Room) => {
                return newRoom;
            }),
            catchError((err) => of({ error: err.message })),
        );
    }

    @Post('/join')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FindUserInterceptor, GetRoomInterceptor)
    joinRoom(
        @Body('room') room: Room,
        @Body('user') user: User,
        @Body('member') member: Member,
        @Request() req: any,
    ): Observable<User | Object> {
        return this.roomMembershipService.joinRoom(room, user, member).pipe(
            map((user: User) => {
                return user;
            }),
            catchError((err) => of({ error: err.message })),
        );
    }

    @Post('/leave')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FindUserInterceptor, GetRoomInterceptor)
    leaveRoom(
        @Body('room') room: Room,
        @Body('membership') member: Member,
    ): Observable<Room | Object> {
        return this.roomMembershipService.leaveRoom(room, member).pipe(
            map((newRoom: Room) => {
                return newRoom;
            }),
            catchError((err) => of({ error: err.message })),
        );
    }

    @Post('/stream')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FindUserInterceptor,
        GetRoomInterceptor,
        SetStreamMessageParamInterceptor,
        GetRoomStreamInterceptor,
    )
    createMessage(
        @Body('text') message: string,
        @Body('room') room: Room,
        @Body('stream') stream: Stream,
        @Body('user') user: User,
    ): Observable<Message | Object> {
        return this.roomStreamService
            .createMessage(room, stream, user, message)
            .pipe(
                map((newMessage: Message) => {
                    return newMessage;
                }),
                catchError((err) => of({ error: err.message })),
            );
    }

    @Get('/stream')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FindUserInterceptor,
        GetRoomInterceptor,
        GetRoomStreamInterceptor,
    )
    // GetRoomStreamInterceptor Implies @Query('roomAddress') roomAddress: string,
    getStream(
        @Body('room') room: Room,
        @Body('stream') stream: Stream,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('prev') prevTimestamp: number,
    ): Observable<StreamDeliverableDto | Object> {
        var myDate = new Date();
        myDate.setTime(prevTimestamp);
        return this.roomStreamService
            .readStream(
                room,
                stream,
                {
                    limit: Number(limit),
                    page: Number(page),
                    route:
                        ROOM_ENTRIES_URL +
                        '/stream?roomAddress=' +
                        room.roomAddress,
                },
                myDate,
            )
            .pipe(
                map((stream: StreamDeliverableDto) => {
                    return stream;
                }),
                catchError((err) => of({ error: err.message })),
            );
    }
}
