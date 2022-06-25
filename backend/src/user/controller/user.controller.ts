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

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    findAll(): Observable<User[]> {
        return this.userService.findAll();
    }

    @Get('/stream/messages')
    getStream(@Query('username') username: string): Observable<Stream | any> {
        return this.userService.getStreamMessages(username).pipe(
            map((newStream: Stream) => {
                return newStream;
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
