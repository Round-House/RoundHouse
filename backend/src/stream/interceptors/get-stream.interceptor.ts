import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { StreamService } from '../service/stream.service';

@Injectable()
export class GetStreamInterceptor implements NestInterceptor {
    constructor(private streamService: StreamService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const streamParams: string[] = request.body.streamParams;
        const streamId: StreamEntity | undefined = request.body.streamId;

        delete request.body.stream;

        return this.streamService.getStream(streamId.id, streamParams).pipe(
            switchMap((stream: StreamEntity) => {
                if (streamId.id === stream.id && streamId.id) {
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
