import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from 'src/message/message.module';
import { RoomController } from './controller/room.controller';
import { RoomEntity } from './models/room.entity';
import { RoomService } from './service/room.service';

@Module({
    imports: [TypeOrmModule.forFeature([RoomEntity]), MessageModule],
    controllers: [RoomController],
    providers: [RoomService],
})
export class RoomModule {}
