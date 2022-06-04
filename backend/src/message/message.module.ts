import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamModule } from 'src/stream/stream.module';
import { MessageController } from './controller/message.controller';
import { MessageEntity } from './models/message.entity';
import { MessageService } from './service/message.service';

@Module({
    imports: [TypeOrmModule.forFeature([MessageEntity]), StreamModule],
    controllers: [MessageController],
    providers: [MessageService],
})
export class MessageModule {}
