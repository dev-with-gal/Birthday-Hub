import { Injectable } from '@nestjs/common';
import { db } from '../prisma/prisma.service.js';

@Injectable()
export class AuthUtils {
  findUserByEmail(email: string) {
    return db.User.select('id', 'email', 'passwordHash', 'role')
      .where({ email })
      .first();
  }
}
