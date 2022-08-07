import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetStreamInterceptor } from './interceptors/get-stream.interceptor';
import { SetStreamMessageParamInterceptor } from './interceptors/set-stream-msg-param.interceptor';
import { StreamEntity } from './models/stream.entity';
import { StreamService } from './service/stream.service';

@Module({
    imports: [TypeOrmModule.forFeature([StreamEntity])],
    providers: [
        StreamService,
        GetStreamInterceptor,
        SetStreamMessageParamInterceptor,
    ],
    exports: [StreamService],
})
export class StreamModule {}
