import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { db as dbJs } from './db.js';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  readonly client = dbJs.orm.public;

  async onModuleInit(): Promise<void> {
    await dbJs.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await dbJs.close();
  }
}

const prismaServiceInstance = new PrismaService();
export const db = prismaServiceInstance.client;
