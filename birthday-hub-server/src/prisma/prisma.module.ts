import { Module } from '@nestjs/common';
import { PrismaService, prismaServiceInstance } from './prisma.service.js';

@Module({
  providers: [{ provide: PrismaService, useValue: prismaServiceInstance }],
  exports: [PrismaService],
})
export class PrismaModule {}
