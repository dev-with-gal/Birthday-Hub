import 'dotenv/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AuthUtils } from './auth-utils.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { ACCESS_TOKEN_TTL_SECONDS } from './auth.constants.js';

const jwtSecret = process.env['AUTH_JWT_SECRET'];
if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('AUTH_JWT_SECRET invalid');
}

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: ACCESS_TOKEN_TTL_SECONDS },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthUtils, JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
