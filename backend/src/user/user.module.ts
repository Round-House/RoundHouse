import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/stream/message/models/message.entity';
import { RoomEntity } from 'src/room/models/room.entity';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { StreamModule } from 'src/stream/stream.module';
import { UserController } from './controller/user.controller';
import { UserEntity } from './models/user.entity';
import { UserService } from './service/user.service';
import { ExternalMembershipEntity } from 'src/room/member/models/external-membership.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            RoomEntity,
            MessageEntity,
            StreamEntity,
            ExternalMembershipEntity,
        ]),
        StreamModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
