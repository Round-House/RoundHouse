import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamEntity } from 'src/stream/models/stream.entity';
import { MessageController } from './controller/message.controller';
import { MessageEntity } from './models/message.entity';
import { MessageService } from './service/message.service';

@Module({
    imports: [TypeOrmModule.forFeature([MessageEntity, StreamEntity])],
    controllers: [MessageController],
    providers: [MessageService],
})
export class MessageModule {}
