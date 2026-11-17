export enum ReviewApplicationStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class ReviewApplicationDto {
  status!: ReviewApplicationStatus;
}
