import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scrypt, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ACCESS_TOKEN_TTL_SECONDS } from './auth.constants.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const email =
      typeof loginDto.email === 'string' ? loginDto.email.trim().toLowerCase() : '';
    const password = loginDto.password;
    const user = email
      ? await this.prisma.client.orm.public.User.select(
          'id',
          'email',
          'passwordHash',
          'role',
        )
          .where({ email })
          .first()
      : null;

    if (
      !user ||
      typeof password !== 'string' ||
      !(await this.verifyPassword(password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  private verifyPassword(password: string, encodedHash: string): Promise<boolean> {
    const [saltHex, hashHex] = encodedHash.split(':');
    if (
      !saltHex ||
      !hashHex ||
      !/^[a-f0-9]+$/i.test(saltHex) ||
      !/^[a-f0-9]+$/i.test(hashHex)
    ) {
      return Promise.resolve(false);
    }

    const salt = Buffer.from(saltHex, 'hex');
    const expectedHash = Buffer.from(hashHex, 'hex');
    if (salt.length === 0 || expectedHash.length === 0) {
      return Promise.resolve(false);
    }

    return new Promise((resolve, reject) => {
      scrypt(password, salt, expectedHash.length, (error, derivedHash) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(
          derivedHash.length === expectedHash.length &&
            timingSafeEqual(derivedHash, expectedHash),
        );
      });
    });
  }
}