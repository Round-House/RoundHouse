import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamEntity } from './models/stream.entity';
import { StreamService } from './service/stream.service';

@Module({
    imports: [TypeOrmModule.forFeature([StreamEntity])],
    providers: [StreamService],
})
export class StreamModule {}
