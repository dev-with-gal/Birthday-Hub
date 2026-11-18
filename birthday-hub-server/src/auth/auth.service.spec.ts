import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { scryptSync } from 'node:crypto';
import { AuthUtils } from './auth-utils.js';
import { AuthService } from './auth.service.js';
import { ACCESS_TOKEN_TTL_SECONDS } from './auth.constants.js';

describe('AuthService with the query layer', () => {
  let service: AuthService;
  const utils = {
    findUserByEmail: vi.fn<AuthUtils['findUserByEmail']>(),
  };
  const jwt = { signAsync: vi.fn() };
  const salt = '0123456789abcdef0123456789abcdef';
  const passwordHash = `${salt}:${scryptSync(
    'password123',
    Buffer.from(salt, 'hex'),
    64,
  ).toString('hex')}`;

  beforeEach(async () => {
    vi.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthUtils, useValue: utils },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('normalizes email, verifies the password, and returns a session without the hash', async () => {
    utils.findUserByEmail.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com',
      role: 'EMPLOYEE',
      passwordHash,
    });
    jwt.signAsync.mockResolvedValue('access-token');

    await expect(
      service.login({ email: ' User@Example.com ', password: 'password123' }),
    ).resolves.toEqual({
      accessToken: 'access-token',
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      user: { id: 'user-id', email: 'user@example.com', role: 'EMPLOYEE' },
    });
    expect(utils.findUserByEmail).toHaveBeenCalledWith('user@example.com');
    expect(jwt.signAsync).toHaveBeenCalledWith({
      sub: 'user-id',
      email: 'user@example.com',
      role: 'EMPLOYEE',
    });
  });

  it.each([
    null,
    {
      id: 'user-id',
      email: 'user@example.com',
      role: 'EMPLOYEE' as const,
      passwordHash,
    },
  ])(
    'rejects a missing user or incorrect password without issuing a token',
    async (user) => {
      utils.findUserByEmail.mockResolvedValue(user);

      await expect(
        service.login({
          email: 'user@example.com',
          password: 'incorrect-password',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(jwt.signAsync).not.toHaveBeenCalled();
    },
  );
});
