import { Injectable } from '@nestjs/common';
import {
    ClientProxyFactory,
    Transport,
    ClientProxy,
} from '@nestjs/microservices';

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

    postPlugins(request: string, body: any) {
        return this.client.send<any, any>(request, body);
    }
}
