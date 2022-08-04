import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Stream } from 'src/stream/models/stream.interface';
import { Room } from '../models/room.interface';
import { RoomStreamService } from '../services/room-stream/room-stream.service';

@Injectable()
export class GetRoomStreamInterceptor implements NestInterceptor {
    constructor(private roomStreamService: RoomStreamService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const streamParams: string[] = request.body.streamParams;
        const room: Room = request.body.room;

        return this.roomStreamService
            .getStream(room.stream.id, streamParams)
            .pipe(
                switchMap((stream: Stream) => {
                    if (stream.id === room.stream.id && room.stream.id) {
                        request.body.stream = stream;
                        return next.handle().pipe(
                            map((flow) => {
                                return flow;
                            }),
                        );
                    }
                    throw new Error('Stream not found');
                }),
            );
    }
}
