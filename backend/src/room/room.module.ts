import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamModule } from 'src/stream/stream.module';
import { UserEntity } from 'src/user/models/user.entity';
import { RoomController } from './controller/room.controller';
import { RoomEntity } from './models/room.entity';
import { RoomService } from './service/room.service';
import { MemberModule } from './member/member.module';
import { MemberEntity } from './member/models/member.entity';

@Module({
    imports: [TypeOrmModule.forFeature([RoomEntity, UserEntity, MemberEntity]), StreamModule, MemberModule],
    controllers: [RoomController],
    providers: [RoomService],
})
export class RoomModule {}
