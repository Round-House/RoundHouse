import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from 'src/message/message.module';
import { StreamModule } from 'src/stream/stream.module';
import { UserController } from './controller/user.controller';
import { UserEntity } from './models/user.entity';
import { UserService } from './service/user.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), StreamModule, MessageModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
