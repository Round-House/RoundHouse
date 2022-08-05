import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserEntity } from 'src/user/models/user.entity';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
    constructor(private authService: AuthService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const username: string | undefined = request.user.user.username;

        return this.authService.findOne(username).pipe(
            switchMap((user: UserEntity) => {
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
