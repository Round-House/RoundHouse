import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamModule } from 'src/stream/stream.module';
import { UserEntity } from 'src/user/models/user.entity';
import { RoomController } from './controller/room.controller';
import { RoomEntity } from './models/room.entity';
import { MemberModule } from './member/member.module';
import { MemberEntity } from './member/models/member.entity';
import { RoomCrudService } from './service/room-crud/room-crud.service';
import { RoomMembershipService } from './service/room-membership/room-membership.service';
import { RoomStreamService } from './service/room-stream/room-stream.service';
import { MessageEntity } from 'src/stream/message/models/message.entity';
import { StreamEntity } from 'src/stream/models/stream.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            RoomEntity,
            UserEntity,
            MemberEntity,
            MessageEntity,
            StreamEntity,
        ]),
        StreamModule,
        MemberModule,
    ],
    controllers: [RoomController],
    providers: [RoomCrudService, RoomMembershipService, RoomStreamService],
})
export class RoomModule {}
