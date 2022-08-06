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
import { UserService } from '../service/user.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { StreamDeliverableDto } from 'src/stream/models';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserEntity } from '../models/user.entity';
import { GetUserInterceptor } from '../interceptors/get-user.interceptor';
import { GetStreamInterceptor } from 'src/stream/interceptors/get-stream.interceptor';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { MessageEntity } from 'src/stream/message/models/message.entity';

export const ROOM_ENTRIES_URL = 'http://localhost:3000/api/users';
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/admin')
    getAdmin(): Observable<UserEntity> {
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
    ): Observable<Pagination<UserEntity>> {
        limit = limit > 100 ? 100 : limit;
        return this.userService.findAll({
            limit: Number(limit),
            page: Number(page),
            route: ROOM_ENTRIES_URL,
        });
    }

    @Get('/stream/messages')
    @UseInterceptors(GetUserInterceptor)
    getStream(
        @Body('user') user: UserEntity,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Observable<StreamDeliverableDto | Object> {
        return this.userService
            .getStreamMessages(user, {
                limit: Number(limit),
                page: Number(page),
                route:
                    ROOM_ENTRIES_URL +
                    '/stream/messages?username=' +
                    user.username,
            })
            .pipe(
                map((stream: StreamDeliverableDto) => {
                    return stream;
                }),
                catchError((err) => of({ error: err.message })),
            );
    }

    @Post('/stream/write')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(GetUserInterceptor, GetStreamInterceptor)
    writeToStream(
        @Body('text') message: string,
        @Body('stream') stream: StreamEntity,
        @Body('user') user: UserEntity,
    ): Observable<MessageEntity | any> {
        return this.userService.writeToStream(message, user, stream).pipe(
            map((newMessage: MessageEntity) => {
                return newMessage;
            }),
            catchError((err) => of({ error: err.message })),
        );
    }
}
