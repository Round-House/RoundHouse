import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserEntity } from '../models/user.entity';
import { UserService } from '../service/user.service';

@Injectable()
export class GetUserInterceptor implements NestInterceptor {
    constructor(private userService: UserService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const username: string | undefined = request.body.username;

        return this.userService.findOne(username, ['stream']).pipe(
            switchMap((user: UserEntity) => {
                if (user.username === username && username) {
                    request.body.user = user;
                    request.body.streamId = user.stream;
                    return next.handle().pipe(
                        map((flow) => {
                            return flow;
                        }),
                    );
                }
                throw new Error('User not found');
            }),
        );
    }
}
