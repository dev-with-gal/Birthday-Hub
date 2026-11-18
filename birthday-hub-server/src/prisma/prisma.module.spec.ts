import { Test } from '@nestjs/testing';
import { ApplicationsUtils } from '../applications/applications-utils.js';
import { AuthUtils } from '../auth/auth-utils.js';
import { UsersUtils } from '../users/users-utils.js';
import { PrismaModule } from './prisma.module.js';
import { PrismaService, db, prismaServiceInstance } from './prisma.service.js';

const mocks = vi.hoisted(() => {
  const user = {
    select: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    first: vi.fn().mockResolvedValue(null),
  };
  const department = {
    select: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    first: vi.fn().mockResolvedValue(null),
  };
  return {
    db: {
      connect: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
      orm: { public: { User: user, Department: department } },
    },
  };
});

vi.mock('./db.js', () => ({ db: mocks.db }));

describe('shared Prisma service', () => {
  it('uses the exported instance for the lifecycle and module query utilities', async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ApplicationsUtils, AuthUtils, UsersUtils],
    }).compile();

    try {
      expect(module.get(PrismaService)).toBe(prismaServiceInstance);
      expect(prismaServiceInstance.client).toBe(db);
      await module.init();
      expect(mocks.db.connect).toHaveBeenCalledTimes(1);

      await module.get(UsersUtils).findByEmail('user@example.com');
      await module.get(AuthUtils).findUserByEmail('user@example.com');
      await module.get(ApplicationsUtils).findDepartmentByName('Engineering');

      expect(mocks.db.orm.public.User.select).toHaveBeenCalledWith('id');
      expect(mocks.db.orm.public.User.select).toHaveBeenCalledWith(
        'id',
        'email',
        'passwordHash',
        'role',
      );
      expect(mocks.db.orm.public.Department.where).toHaveBeenCalledWith({
        name: 'Engineering',
      });
    } finally {
      await module.close();
    }

    expect(mocks.db.close).toHaveBeenCalledTimes(1);
  });
});
