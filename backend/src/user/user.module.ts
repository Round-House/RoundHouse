import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from 'src/message/message.module';
import { RoomEntity } from 'src/room/models/room.entity';
import { UserController } from './controller/user.controller';
import { UserEntity } from './models/user.entity';
import { UserService } from './service/user.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, RoomEntity]),  MessageModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
