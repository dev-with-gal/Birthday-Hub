#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/5cdbaa71b4f55d69356f53c86ce787f077449ff84bb2f1484d805c4b921e85a7/contract';
import startContract from '../../snapshots/5cdbaa71b4f55d69356f53c86ce787f077449ff84bb2f1484d805c4b921e85a7/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/e0b3de4cb5c06dea820526c2d239b33c0002078e34b34bdc67fff42cad0ac183/contract';
import endContract from '../../snapshots/e0b3de4cb5c06dea820526c2d239b33c0002078e34b34bdc67fff42cad0ac183/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'Employee' }),
      this.createTable({
        schema: 'public',
        table: 'BirthdayApplication',
        columns: [
          col('applicationNumber', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('approvedById', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('birthday', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('departmentId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('firstName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('lastName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('reviewedAt', 'timestamptz(3)', {
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('submittedById', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'BirthdayApplication_status_check_56005a61',
            sql`"status" IN ('PENDING', 'APPROVED', 'REJECTED')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Department',
        columns: [
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('passwordHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('EMPLOYEE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'User_role_check_535664fb',
            sql`"role" IN ('EMPLOYEE', 'COORDINATOR', 'HR_MANAGER')`,
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'BirthdayApplication',
        constraint: 'BirthdayApplication_applicationNumber_key',
        columns: ['applicationNumber'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Department',
        constraint: 'Department_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'BirthdayApplication',
        index: 'BirthdayApplication_approvedById_idx_01ef8410',
        columns: ['approvedById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'BirthdayApplication',
        index: 'BirthdayApplication_departmentId_idx_8e261ed8',
        columns: ['departmentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'BirthdayApplication',
        index: 'BirthdayApplication_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'BirthdayApplication',
        index: 'BirthdayApplication_submittedById_idx_89341c73',
        columns: ['submittedById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'User',
        index: 'User_role_idx_2c1ddf83',
        columns: ['role'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'BirthdayApplication',
        foreignKey: {
          name: 'BirthdayApplication_departmentId_fkey',
          columns: ['departmentId'],
          references: { schema: 'public', table: 'Department', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'BirthdayApplication',
        foreignKey: {
          name: 'BirthdayApplication_submittedById_fkey',
          columns: ['submittedById'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'BirthdayApplication',
        foreignKey: {
          name: 'BirthdayApplication_approvedById_fkey',
          columns: ['approvedById'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
