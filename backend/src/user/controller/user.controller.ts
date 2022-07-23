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
import { catchError, from, map, Observable, of } from 'rxjs';
import { CreateMessageDto } from 'src/stream/message/models';
import { Message } from 'src/stream/message/models/message.interface';
import { Stream } from 'src/stream/models/stream.interface';
import { User } from '../models/user.interface';
import { UserService } from '../service/user.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { StreamDeliverableDto } from 'src/stream/models';

export const ROOM_ENTRIES_URL = 'http://localhost:3000/api/users';
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/admin')
    getAdmin(): Observable<User> {
        return this.userService.getAdmin();
    }

    @Get('/checkUsernameTaken')
    checkUsernameTaken(
        @Query('username') username: string,
    ): Observable<boolean> {
        return this.userService.checkUsernameTaken(username);
    }

    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Observable<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;
        return this.userService.findAll({
            limit: Number(limit),
            page: Number(page),
            route: ROOM_ENTRIES_URL,
        });
    }

    @Get('/stream/messages')
    getStream(
        @Query('username') username: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Observable<StreamDeliverableDto | Object> {
        return this.userService
            .getStreamMessages(username, {
                limit: Number(limit),
                page: Number(page),
                route:
                    ROOM_ENTRIES_URL + '/stream/messages?username=' + username,
            })
            .pipe(
                map((stream: StreamDeliverableDto) => {
                    return stream;
                }),
                catchError((err) => of({ error: err.message })),
            );
    }

    @Post('/stream/write')
    @UseGuards(AuthGuard('jwt'))
    writeToStream(
        @Body() message: CreateMessageDto,
        @Request() req: any,
    ): Observable<Message | any> {
        return this.userService.writeToStream(message, req.user.user).pipe(
            map((newMessage: Message) => {
                return newMessage;
            }),
            catchError((err) => of({ error: err.message })),
        );
    }
}
