import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './guards/jwt.strategy';
import { UserAuthEntity } from './models/userAuth.entity';
import { AuthService } from './service/auth.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, UserAuthEntity]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '30 days' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
