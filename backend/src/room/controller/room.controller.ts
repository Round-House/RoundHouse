import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { CreateRoomDto } from '../models/create-room.dto';
import { RoomCrudService } from '../services/room-crud/room-crud.service';
import { RoomMembershipService } from '../services/room-membership/room-membership.service';
import { RoomStreamService } from '../services/room-stream/room-stream.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { StreamDeliverableDto } from 'src/stream/models';
import { TreeRoomDto } from '../models';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthUserInterceptor } from 'src/auth/interceptors/auth-user.interceptor';
import { GetRoomInterceptor } from '../interceptors/get-room.interceptor';
import { SetStreamMessageParamInterceptor } from '../../stream/interceptors/set-stream-msg-param.interceptor';
import { MemberEntity } from '../member/models/member.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { RoomEntity } from '../models/room.entity';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { MessageEntity } from 'src/stream/message/models/message.entity';
import { GetStreamInterceptor } from 'src/stream/interceptors/get-stream.interceptor';

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
    ): Observable<RoomEntity | Object> {
        return this.roomCrudService.getRoom(roomAddress, []);
    }

    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Observable<Pagination<RoomEntity>> {
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
        @Body('room') room: RoomEntity,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Observable<Pagination<MemberEntity>> {
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
    @UseInterceptors(AuthUserInterceptor)
    getRootRooms(@Body('user') user: UserEntity): Observable<TreeRoomDto[]> {
        return this.roomMembershipService.getRootRooms(user);
    }

    @Get('/subRooms')
    @UseInterceptors(GetRoomInterceptor)
    getSubRooms(
        @Body('room') room: RoomEntity,
    ): Observable<RoomEntity | Object> {
        return this.roomMembershipService.getSubRooms(room).pipe(
            map((rooms: RoomEntity) => {
                return rooms;
            }),
            catchError((err) => of({ error: err.message })),
        );
    }

    @Get('/usersSubRooms')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthUserInterceptor, GetRoomInterceptor)
    getUsersSubRooms(
        @Body('room') room: RoomEntity,
        @Body('user') user: UserEntity,
    ): Observable<TreeRoomDto[] | Object> {
        return this.roomMembershipService.getUsersSubRooms(user, room).pipe(
            map((rooms: TreeRoomDto[]) => {
                return rooms;
            }),
            catchError((err) => of({ error: err.message })),
        );
    }

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthUserInterceptor)
    createRoom(
        @Body() newRoom: CreateRoomDto,
        @Body('user') user: UserEntity,
    ): Observable<RoomEntity | Object> {
        return this.roomCrudService.createRoom(newRoom, user).pipe(
            map((newRoom: RoomEntity) => {
                return newRoom;
            }),
            catchError((err) => of({ error: err.message })),
        );
    }

    @Post('/join')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthUserInterceptor, GetRoomInterceptor)
    joinRoom(
        @Body('room') room: RoomEntity,
        @Body('user') user: UserEntity,
        @Body('member') member: MemberEntity,
    ): Observable<UserEntity | Object> {
        console.log(room);
        return this.roomMembershipService.joinRoom(room, user, member).pipe(
            map((user: UserEntity) => {
                return user;
            }),
            catchError((err) => of({ error: err.message })),
        );
    }

    @Post('/leave')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthUserInterceptor, GetRoomInterceptor)
    leaveRoom(
        @Body('room') room: RoomEntity,
        @Body('membership') member: MemberEntity,
    ): Observable<RoomEntity | Object> {
        return this.roomMembershipService.leaveRoom(room, member).pipe(
            map((newRoom: RoomEntity) => {
                return newRoom;
            }),
            catchError((err) => of({ error: err.message })),
        );
    }

    @Post('/stream')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AuthUserInterceptor,
        GetRoomInterceptor,
        SetStreamMessageParamInterceptor,
        GetStreamInterceptor,
    )
    createMessage(
        @Body('text') message: string,
        @Body('room') room: RoomEntity,
        @Body('stream') stream: StreamEntity,
        @Body('user') user: UserEntity,
    ): Observable<MessageEntity | Object> {
        return this.roomStreamService
            .createMessage(room, stream, user, message)
            .pipe(
                map((newMessage: MessageEntity) => {
                    return newMessage;
                }),
                catchError((err) => of({ error: err.message })),
            );
    }

    @Get('/stream')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        AuthUserInterceptor,
        GetRoomInterceptor,
        GetStreamInterceptor,
    )
    // GetRoomStreamInterceptor Implies @Query('roomAddress') roomAddress: string,
    getStream(
        @Body('room') room: RoomEntity,
        @Body('stream') stream: StreamEntity,
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
