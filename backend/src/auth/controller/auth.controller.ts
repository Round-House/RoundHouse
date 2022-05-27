import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../models/create-user.dto';
import { LoginUserDto } from '../models/login-user.dto';
import { catchError, from, map, Observable, of } from 'rxjs';
import { UserJwtDto } from '../models';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    //User Authentication
    @Post('local/register')
    regiesterLocal(
        @Body() user: CreateUserDto,
    ): Observable<UserJwtDto | Object> {
        return this.authService.regiesterLocal(user).pipe(
            map((user: UserJwtDto) => user),
            catchError((err) => of({ error: err.message })),
        );
    }

    @Get('local/login')
    loginLocal(@Body() user: LoginUserDto): Observable<Object> {
        return this.authService.loginLocal(user).pipe(
            map((jwt: string) => {
                return { access_token: jwt };
            }),
            catchError((err) => of({ error: err.message })),
        );
    }

    @Post('local/logout')
    logoutLocal() {
        this.authService.logoutLocal();
    }

    @Post('local/refresh')
    refreshLocal() {
        this.authService.refreshLocal();
    }

    //TODO: ActivityPub Authentication
    @Post('remote/register')
    regiesterRemote() {}

    @Post('remote/login')
    loginRemote() {}

    @Post('remote/logout')
    logoutRemote() {}

    @Post('remote/refresh')
    refreshRemote() {}
}
