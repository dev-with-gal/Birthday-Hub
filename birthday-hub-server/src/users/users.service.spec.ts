import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersUtils } from './users-utils.js';

describe('UsersService', () => {
  let service: UsersService;
  const utils = {
    findByEmail: vi.fn<UsersUtils['findByEmail']>(),
    create: vi.fn<UsersUtils['create']>(),
    findOne: vi.fn<UsersUtils['findOne']>(),
    update: vi.fn<UsersUtils['update']>(),
    remove: vi.fn<UsersUtils['remove']>(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: UsersUtils, useValue: utils }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('normalizes email and hashes passwords before persisting a new employee', async () => {
    utils.findByEmail.mockResolvedValue(null);
    await service.create({
      email: ' User@Example.com ',
      password: 'password123',
    });

    expect(utils.findByEmail).toHaveBeenCalledWith('user@example.com');
    expect(utils.create).toHaveBeenCalledWith({
      email: 'user@example.com',
      passwordHash: expect.stringMatching(/^[a-f0-9]{32}:[a-f0-9]{128}$/),
      role: 'EMPLOYEE',
    });
  });

  it('rejects duplicate email without creating a user', async () => {
    utils.findByEmail.mockResolvedValue({ id: 'existing-id' });

    await expect(
      service.create({ email: 'user@example.com', password: 'password123' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(utils.create).not.toHaveBeenCalled();
  });

  it('rejects invalid passwords before accessing the query layer', async () => {
    await expect(
      service.create({ email: 'user@example.com', password: 'short' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(utils.findByEmail).not.toHaveBeenCalled();
  });

  it('reports a missing user when an update matches no record', async () => {
    utils.update.mockResolvedValue(null);

    await expect(
      service.update('missing-id', { email: ' Updated@Example.com ' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(utils.update).toHaveBeenCalledWith('missing-id', {
      email: 'updated@example.com',
    });
  });

  it('does not delete a user that does not exist', async () => {
    utils.findOne.mockResolvedValue(null);

    await expect(service.remove('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(utils.remove).not.toHaveBeenCalled();
  });
});
