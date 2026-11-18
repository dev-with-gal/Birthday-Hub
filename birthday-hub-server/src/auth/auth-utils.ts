import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthUtils {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.client.User.select('id', 'email', 'passwordHash', 'role')
      .where({ email })
      .first();
  }
}
