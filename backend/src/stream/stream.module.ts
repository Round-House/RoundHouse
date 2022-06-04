import { Module } from '@nestjs/common';
import { StreamService } from './service/stream.service';

@Module({
  providers: [StreamService]
})
export class StreamModule {}
