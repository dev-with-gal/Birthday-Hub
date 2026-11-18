import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { db } from './db.js';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  readonly client = db.orm.public;

  async onModuleInit(): Promise<void> {
    await db.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await db.close();
  }
}
