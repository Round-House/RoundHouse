import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { RoomEntity } from '../models/room.entity';
import { RoomStreamService } from '../services/room-stream/room-stream.service';

@Injectable()
export class GetRoomStreamInterceptor implements NestInterceptor {
    constructor(private roomStreamService: RoomStreamService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const streamParams: string[] = request.body.streamParams;
        const room: RoomEntity | undefined = request.body.room;

        delete request.body.stream;

        return this.roomStreamService
            .getStream(room.stream.id, streamParams)
            .pipe(
                switchMap((stream: StreamEntity) => {
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
                catchError((err) => throwError(() => err)),
            );
    }
}
