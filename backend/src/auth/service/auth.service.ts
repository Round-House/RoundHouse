import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { UserJwtDto } from '../models';
import { CreateUserDto } from '../models/create-user.dto';
import { LoginUserDto } from '../models/login-user.dto';
import { User } from 'src/user/models/user.interface';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) {}

    //User Authentication
    regiesterLocal(user: CreateUserDto): Observable<UserJwtDto> {
        return this.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.email = user.email;
                newUser.nickname = user.nickname;
                newUser.username = user.username;
                newUser.password = passwordHash;

                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const responce = new UserJwtDto();
                        responce.email = user.email;
                        responce.username = user.username;

                        return responce;
                    }),
                    catchError((err) => throwError(() => err)),
                );
            }),
        );
    }

    private hashPassword(password: string): Observable<string> {
        return from<string>(bcrypt.hash(password, 10));
    }

    loginLocal(credentials: LoginUserDto): Observable<string> {
        return this.getUser(credentials.username).pipe(
            switchMap((user: User) =>
                this.comparePasswords(credentials.password, user.password).pipe(
                    switchMap((match: boolean) => {
                        if (match) {
                            const userJwt = new UserJwtDto();
                            userJwt.email = user.email;
                            userJwt.username = user.username;
                            return this.generateJWT(userJwt).pipe(
                                map((jwt: string) => jwt),
                            );
                        } else {
                            throw new UnauthorizedException(
                                'Not authenticated',
                            );
                        }
                    }),
                ),
            ),
            catchError((err) => throwError(() => err)),
        );
    }

    private comparePasswords(
        password: string,
        hash: string,
    ): Observable<any | boolean> {
        return from<any | boolean>(bcrypt.compare(password, hash));
    }

    logoutLocal() {}

    refreshLocal() {}

    private generateJWT(user: UserJwtDto): Observable<string> {
        return from(this.jwtService.signAsync({ user }));
    }

    private getUser(usernameOrEmail: string): Observable<User> {
        //Could not find email check function, using regex: https://www.emailregex.com/
        const emailCheck =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (emailCheck.test(usernameOrEmail)) {
            usernameOrEmail = usernameOrEmail.toLocaleLowerCase();
            return from(
                this.userRepository.findOne({ email: usernameOrEmail }),
            );
        } else {
            return from(
                this.userRepository.findOne({ username: usernameOrEmail }),
            );
        }
    }
}
