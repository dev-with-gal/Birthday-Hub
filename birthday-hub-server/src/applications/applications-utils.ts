import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ApplicationStatus } from './application.types.js';
import type {
  CreateApplicationData,
  ReviewApplicationData,
} from './application.types.js';

@Injectable()
export class ApplicationsUtils {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.client.BirthdayApplication.select(
      'id',
      'applicationNumber',
      'firstName',
      'lastName',
      'birthday',
      'status',
      'createdAt',
    )
      .include('department', (department) => department.select('name'))
      .orderBy((application) => application.createdAt.desc())
      .all();
  }

  findMine(submittedById: string) {
    return this.prisma.client.BirthdayApplication.select(
      'id',
      'applicationNumber',
      'firstName',
      'lastName',
      'birthday',
      'status',
      'createdAt',
    )
      .where({ submittedById })
      .include('department', (department) => department.select('name'))
      .orderBy((application) => application.createdAt.desc())
      .all();
  }

  findApproved() {
    return this.prisma.client.BirthdayApplication.select(
      'id',
      'applicationNumber',
      'firstName',
      'lastName',
      'birthday',
      'status',
      'createdAt',
    )
      .where({ status: ApplicationStatus.APPROVED })
      .include('department', (department) => department.select('name'))
      .orderBy((application) => application.birthday.asc())
      .all();
  }

  findReviewState(id: string) {
    return this.prisma.client.BirthdayApplication.select('id', 'status')
      .where({ id })
      .firstOrThrow();
  }

  updateReview(
    id: string,
    expectedStatus: ApplicationStatus,
    data: ReviewApplicationData,
  ) {
    return this.prisma.client.BirthdayApplication.select(
      'id',
      'status',
      'reviewedAt',
      'approvedById',
    )
      .where({ id, status: expectedStatus })
      .update(data);
  }

  findDepartmentByName(name: string) {
    return this.prisma.client.Department.select('id')
      .where({ name })
      .first();
  }

  createDepartment(name: string) {
    return this.prisma.client.Department.select('id').create({ name });
  }

  create(data: CreateApplicationData) {
    return this.prisma.client.BirthdayApplication.select(
      'id',
      'applicationNumber',
      'firstName',
      'lastName',
      'birthday',
      'departmentId',
      'status',
      'createdAt',
    ).create(data);
  }
}
