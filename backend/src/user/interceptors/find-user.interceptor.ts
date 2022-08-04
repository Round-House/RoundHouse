import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../models/user.interface';
import { UserService } from '../service/user.service';

@Injectable()
export class FindUserInterceptor implements NestInterceptor {
    constructor(private userService: UserService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const username = request.user.user.username;

        return this.userService.findOne(username).pipe(
            switchMap((user: User) => {
                if (user.username === username && username) {
                    request.body.user = user;
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
