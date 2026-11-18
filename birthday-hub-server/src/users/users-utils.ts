import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateUserData, UpdateUserData } from './user.types.js';

@Injectable()
export class UsersUtils {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.client.User.select('id').where({ email }).first();
  }

  create(data: CreateUserData) {
    return this.prisma.client.User.select(
      'id',
      'email',
      'role',
      'createdAt',
      'updatedAt',
    ).create(data);
  }

  findAll() {
    return this.prisma.client.User.select(
      'id',
      'email',
      'role',
      'createdAt',
      'updatedAt',
    ).all();
  }

  findOne(id: string) {
    return this.prisma.client.User.select(
      'id',
      'email',
      'role',
      'createdAt',
      'updatedAt',
    )
      .where({ id })
      .first();
  }

  update(id: string, data: UpdateUserData) {
    return this.prisma.client.User.select(
      'id',
      'email',
      'role',
      'createdAt',
      'updatedAt',
    )
      .where({ id })
      .update(data);
  }

  remove(id: string) {
    return this.prisma.client.User.where({ id }).delete();
  }
}
