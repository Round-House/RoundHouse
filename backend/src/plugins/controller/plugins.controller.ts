import { Body, Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PluginsService } from '../service/plugins.service';

@Controller('plugins')
export class PluginsController {
    constructor(private pluginsService: PluginsService) {}

    @Get()
    getPlugins(@Query() query: any, @Body() body: any): Observable<any> {
        return this.pluginsService.getPlugins(query.plugin, body);
    }
}
