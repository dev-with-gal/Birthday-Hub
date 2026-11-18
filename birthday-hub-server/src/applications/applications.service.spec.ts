import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ApplicationsUtils } from './applications-utils.js';
import { ApplicationsService } from './applications.service.js';
import { ApplicationStatus } from './application.types.js';
import { ReviewApplicationStatus } from './dto/review-application.dto.js';

describe('ApplicationsService with the query layer', () => {
  let service: ApplicationsService;
  const utils = {
    findReviewState: vi.fn<ApplicationsUtils['findReviewState']>(),
    updateReview: vi.fn<ApplicationsUtils['updateReview']>(),
    findDepartmentByName: vi.fn<ApplicationsUtils['findDepartmentByName']>(),
    createDepartment: vi.fn<ApplicationsUtils['createDepartment']>(),
    create: vi.fn<ApplicationsUtils['create']>(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: ApplicationsUtils, useValue: utils },
      ],
    }).compile();
    service = module.get(ApplicationsService);
  });

  it.each([
    [ReviewApplicationStatus.APPROVED, 'reviewer-id'],
    [ReviewApplicationStatus.REJECTED, null],
  ])('keeps %s review decisions in the service', async (status, approvedById) => {
    utils.findReviewState.mockResolvedValue({
      id: 'application-id',
      status: ApplicationStatus.PENDING,
    });
    const updated = {
      id: 'application-id',
      status,
      approvedById,
      reviewedAt: new Date(),
    };
    utils.updateReview.mockResolvedValue(updated);

    await expect(
      service.review('application-id', { status }, 'reviewer-id', 'COORDINATOR'),
    ).resolves.toEqual(updated);
    expect(utils.updateReview).toHaveBeenCalledWith(
      'application-id',
      ApplicationStatus.PENDING,
      { status, approvedById, reviewedAt: expect.any(Date) },
    );
  });

  it('reports a conflict when another request reviews the application first', async () => {
    utils.findReviewState.mockResolvedValue({
      id: 'application-id',
      status: ApplicationStatus.PENDING,
    });
    utils.updateReview.mockResolvedValue(null);

    await expect(
      service.review(
        'application-id',
        { status: ReviewApplicationStatus.APPROVED },
        'reviewer-id',
        'COORDINATOR',
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('reuses a concurrently created department and passes normalized data to the query layer', async () => {
    utils.findDepartmentByName
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'department-id' });
    utils.createDepartment.mockRejectedValue(new Error('Concurrent creation'));

    await service.create(
      {
        firstName: ' First ',
        lastName: ' Last ',
        department: ' הנדסה ',
        birthday: '2000-02-29',
      },
      'user-id',
    );

    expect(utils.create).toHaveBeenCalledWith({
      firstName: 'First',
      lastName: 'Last',
      departmentId: 'department-id',
      submittedById: 'user-id',
      birthday: new Date('2000-02-29T00:00:00.000Z'),
    });
  });

  it('rejects invalid birthdays before calling the query layer', async () => {
    await expect(
      service.create(
        {
          firstName: 'First',
          lastName: 'Last',
          department: 'הנדסה',
          birthday: '2001-02-29',
        },
        'user-id',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(utils.findDepartmentByName).not.toHaveBeenCalled();
    expect(utils.create).not.toHaveBeenCalled();
  });
});
