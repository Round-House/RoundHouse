import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserJwtDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
}
