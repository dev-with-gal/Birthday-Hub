import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt } from 'node:crypto';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const email = this.normalizeEmail(createUserDto.email);
    const password = this.validatePassword(createUserDto.password);
    const existing = await this.prisma.client.orm.public.User.select('id')
      .where({ email })
      .first();

    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await this.hashPassword(password);
    return this.prisma.client.orm.public.User.select(
      'id',
      'email',
      'role',
      'createdAt',
      'updatedAt',
    ).create({ email, passwordHash, role: 'EMPLOYEE' });
  }

  findAll() {
    return this.prisma.client.orm.public.User.select(
      'id',
      'email',
      'role',
      'createdAt',
      'updatedAt',
    ).all();
  }

  async findOne(id: string) {
    const user = await this.prisma.client.orm.public.User.select(
      'id',
      'email',
      'role',
      'createdAt',
      'updatedAt',
    )
      .where({ id })
      .first();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updates: { email?: string; passwordHash?: string } = {};

    if (updateUserDto.email !== undefined) {
      updates.email = this.normalizeEmail(updateUserDto.email);
    }
    if (updateUserDto.password !== undefined) {
      updates.passwordHash = await this.hashPassword(
        this.validatePassword(updateUserDto.password),
      );
    }
    if (Object.keys(updates).length === 0) {
      return this.findOne(id);
    }

    const updated = await this.prisma.client.orm.public.User.select(
      'id',
      'email',
      'role',
      'createdAt',
      'updatedAt',
    )
      .where({ id })
      .update(updates);

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.client.orm.public.User.where({ id }).delete();
    return { id };
  }

  private normalizeEmail(email: string): string {
    const normalizedEmail =
      typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new BadRequestException('A valid email is required');
    }
    return normalizedEmail;
  }

  private validatePassword(password: string): string {
    if (
      typeof password !== 'string' ||
      password.length < 8 ||
      password.length > 128
    ) {
      throw new BadRequestException(
        'Password must be between 8 and 128 characters',
      );
    }
    return password;
  }

  private hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16);
    return new Promise((resolve, reject) => {
      scrypt(password, salt, 64, (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(`${salt.toString('hex')}:${derivedKey.toString('hex')}`);
      });
    });
  }
}
