import { Injectable } from '@nestjs/common';
import {
    ClientProxyFactory,
    Transport,
    ClientProxy,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class PluginsService {
    private client: ClientProxy;

    constructor() {
        this.client = ClientProxyFactory.create({
            transport: Transport.REDIS,
            options: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT),
            },
        });
    }

    getPlugins(plugin: string, body: any): Observable<any> {
        return this.client.send<any>(plugin, body);
    }
}
