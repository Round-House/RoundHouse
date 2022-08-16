import { Module } from '@nestjs/common';
import { PluginsController } from './controller/plugins.controller';
import { PluginsService } from './service/plugins.service';

@Module({
    controllers: [PluginsController],
    providers: [PluginsService],
})
export class PluginsModule {}
