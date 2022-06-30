import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { RoomEntity } from '../models/room.entity';
import { MemberEntity } from './models/member.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MemberEntity, RoomEntity, UserEntity])],
})
export class MemberModule {}
