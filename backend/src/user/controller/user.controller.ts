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
import { CreateMessageDto } from 'src/message/models';
import { Message } from 'src/message/models/message.interface';
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

    @Get('/stream')
    getStream(@Query('username') username: string): Observable<Stream | any> {
        return this.userService.getStream(username).pipe(
            map((newStream: Stream) => {
                return newStream;
            }),
            catchError((err) => of({ error: err.message })),
        );
    }

    @Post('/stream/create')
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
