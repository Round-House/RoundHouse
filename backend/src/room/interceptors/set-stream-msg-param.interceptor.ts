import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoomStreamService } from '../services/room-stream/room-stream.service';

@Injectable()
export class SetStreamMessageParamInterceptor implements NestInterceptor {
    constructor(private roomStreamService: RoomStreamService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        request.body.streamParams = ['messages'];
        return next.handle().pipe(
            map((flow) => {
                return flow;
            }),
        );
    }
}
