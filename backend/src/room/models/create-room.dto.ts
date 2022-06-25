import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
    
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description: string;
    
    @IsString()
    @IsOptional()
    parentRoomAddress: string;
}
