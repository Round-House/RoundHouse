import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { UserJwtDto } from '../models';
import { CreateUserDto } from '../models/create-user.dto';
import { LoginUserDto } from '../models/login-user.dto';
import { User, UserRole } from 'src/user/models/user.interface';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { UserAuthEntity } from '../models/userAuth.entity';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) {}

    findOne(username: string): Observable<UserEntity> {
        return from(
            this.userRepository.findOne({
                where: { username },
            }),
        ).pipe(
            map((user: UserEntity) => {
                return user;
            }),
        );
    }

    //User Authentication
    regiesterLocal(user: CreateUserDto): Observable<UserJwtDto> {
        return this.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                if (user.username.length < 3) {
                    throw Error('Username must be at least 3 characters long');
                }
                if (user.username.length > 30) {
                    throw Error('Username must be at most 30 caracters long');
                }
                if (user.username.includes('@')) {
                    throw Error('Username cannot contain an @ symbol');
                }
                const usernameCheck = /^[a-zA-Z0-9_\-]+$/g;
                if (!usernameCheck.test(user.username)) {
                    throw Error('Username must be alphanumeric');
                }
                return from(
                    this.userRepository.findOne({
                        where: { username: user.username },
                    }),
                ).pipe(
                    switchMap((usernameMatch: User) => {
                        if (usernameMatch) {
                            throw Error('Username is already in use');
                        }

                        const newUser = new UserEntity();
                        newUser.auth = new UserAuthEntity();
                        newUser.auth.email = user.email;
                        newUser.username = user.username;
                        newUser.nickname = user.nickname;
                        newUser.auth.passwordHash = passwordHash;
                        newUser.stream = new StreamEntity();

                        return from(this.userRepository.count({})).pipe(
                            switchMap((count: number) => {
                                if (count === 0) {
                                    newUser.role = UserRole.ADMIN;
                                }
                                return from(
                                    this.userRepository.save(newUser),
                                ).pipe(
                                    map((user: User) => {
                                        const responce = new UserJwtDto();
                                        responce.email = user.auth.email;
                                        responce.username = user.username;

                                        return responce;
                                    }),
                                    catchError((err) => throwError(() => err)),
                                );
                            }),
                            catchError((err) => throwError(() => err)),
                        );
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
                this.comparePasswords(
                    credentials.password,
                    user.auth.passwordHash,
                ).pipe(
                    switchMap((match: boolean) => {
                        if (match) {
                            const userJwt = new UserJwtDto();
                            userJwt.email = user.auth.email;
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
                    catchError((err) => throwError(() => err)),
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
                this.userRepository
                    .createQueryBuilder('user')
                    .leftJoinAndSelect('user.auth', 'auth')
                    .where('auth.email = :email', { email: usernameOrEmail })
                    .getOne(),
            );
        } else {
            return from(
                this.userRepository.findOne({
                    where: { username: usernameOrEmail },
                    relations: {
                        auth: true,
                    },
                }),
            );
        }
    }
}
