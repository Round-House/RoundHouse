import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from 'src/user/models/user.interface';

export class CreateRoomDto {
    
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;
    
    @IsString()
    parentRoomAddress: string;
}
