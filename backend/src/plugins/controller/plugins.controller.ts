import { Body, Controller, Post, Query } from '@nestjs/common';
import { PluginsService } from '../service/plugins.service';

@Controller('plugins')
export class PluginsController {
    constructor(private pluginsService: PluginsService) {}

    @Post()
    postPlugins(@Query() query: any, @Body() body: any) {
        return this.pluginsService.postPlugins(query.request, body);
    }
}
