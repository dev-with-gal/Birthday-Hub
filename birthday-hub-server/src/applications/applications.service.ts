import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ApplicationsUtils } from './applications-utils.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import {
  ReviewApplicationDto,
  ReviewApplicationStatus,
} from './dto/review-application.dto.js';
import { ApplicationStatus } from './application.types.js';

const allowedDepartments = new Set([
  'הנדסה',
  'שיווק',
  'עיצוב',
  'מכירות',
  'משאבי אנוש',
]);

@Injectable()
export class ApplicationsService {
  constructor(private readonly applicationsUtils: ApplicationsUtils) {}

  findAll() {
    return this.applicationsUtils.findAll();
  }

  findMine(submittedById: string) {
    return this.applicationsUtils.findMine(submittedById);
  }

  findApproved() {
    return this.applicationsUtils.findApproved();
  }

  async review(
    id: string,
    dto: ReviewApplicationDto,
    reviewerId: string,
    reviewerRole: string,
  ) {
    if (reviewerRole !== 'COORDINATOR' && reviewerRole !== 'HR_MANAGER') {
      throw new ForbiddenException('You cannot review applications');
    }
    if (
      dto.status !== ReviewApplicationStatus.APPROVED &&
      dto.status !== ReviewApplicationStatus.REJECTED
    ) {
      throw new BadRequestException('Status must be APPROVED or REJECTED');
    }

    const existing = await this.applicationsUtils.findReviewState(id);
    if (existing.status !== ApplicationStatus.PENDING) {
      throw new ConflictException('Application has already been reviewed');
    }

    const updated = await this.applicationsUtils.updateReview(
      id,
      ApplicationStatus.PENDING,
      {
        status: dto.status,
        reviewedAt: new Date(),
        approvedById:
          dto.status === ReviewApplicationStatus.APPROVED ? reviewerId : null,
      },
    );

    if (!updated) {
      throw new ConflictException('Application has already been reviewed');
    }

    return updated;
  }

  async create(dto: CreateApplicationDto, submittedById: string) {
    const firstName = this.validateName(dto.firstName, 'first name');
    const lastName = this.validateName(dto.lastName, 'last name');
    const departmentName =
      typeof dto.department === 'string' ? dto.department.trim() : '';

    if (!allowedDepartments.has(departmentName)) {
      throw new BadRequestException('Choose a valid department');
    }

    if (
      typeof dto.birthday !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(dto.birthday)
    ) {
      throw new BadRequestException('A valid birthday is required');
    }
    const birthday = new Date(`${dto.birthday}T00:00:00.000Z`);
    if (
      Number.isNaN(birthday.getTime()) ||
      birthday.toISOString().slice(0, 10) !== dto.birthday
    ) {
      throw new BadRequestException('A valid birthday is required');
    }

    const existingDepartment =
      await this.applicationsUtils.findDepartmentByName(departmentName);
    let departmentId = existingDepartment?.id;

    if (!departmentId) {
      try {
        const createdDepartment =
          await this.applicationsUtils.createDepartment(departmentName);
        departmentId = createdDepartment.id;
      } catch (error) {
        const concurrentDepartment =
          await this.applicationsUtils.findDepartmentByName(departmentName);
        if (!concurrentDepartment) {
          throw error;
        }
        departmentId = concurrentDepartment.id;
      }
    }

    return this.applicationsUtils.create({
      firstName,
      lastName,
      birthday,
      departmentId,
      submittedById,
    });
  }

  private validateName(value: string, field: string): string {
    const name = typeof value === 'string' ? value.trim() : '';
    if (!name || name.length > 80) {
      throw new BadRequestException(`A valid ${field} is required`);
    }
    return name;
  }
}
