import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StreamModule } from './stream/stream.module';
import { RoomModule } from './room/room.module';
import { MessageModule } from './stream/message/message.module';
import { MemberModule } from './room/member/member.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `./../.env`,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.PGHOST,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            autoLoadEntities: true,
            synchronize: true,
        }),
        AuthModule,
        UserModule,
        StreamModule,
        RoomModule,
        MessageModule,
        MemberModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
