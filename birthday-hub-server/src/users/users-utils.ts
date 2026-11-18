import { Injectable } from '@nestjs/common';
import { db } from '../prisma/prisma.service.js';
import type { CreateUserData, UpdateUserData } from './user.types.js';

@Injectable()
export class UsersUtils {
  findByEmail(email: string) {
    return db.User.select('id').where({ email }).first();
  }

  create(data: CreateUserData) {
    return db.User.select(
      'id',
      'email',
      'role',
      'createdAt',
      'updatedAt',
    ).create(data);
  }

  findAll() {
    return db.User.select('id', 'email', 'role', 'createdAt', 'updatedAt').all();
  }

  findOne(id: string) {
    return db.User.select('id', 'email', 'role', 'createdAt', 'updatedAt')
      .where({ id })
      .first();
  }

  update(id: string, data: UpdateUserData) {
    return db.User.select('id', 'email', 'role', 'createdAt', 'updatedAt')
      .where({ id })
      .update(data);
  }

  remove(id: string) {
    return db.User.where({ id }).delete();
  }
}
