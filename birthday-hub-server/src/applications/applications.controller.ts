import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { AuthenticatedHttpRequest } from '../auth/jwt-auth.guard.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApplicationsService } from './applications.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { ReviewApplicationDto } from './dto/review-application.dto.js';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  findAll() {
    return this.applicationsService.findAll();
  }

  @Get('mine')
  findMine(@Req() request: AuthenticatedHttpRequest) {
    return this.applicationsService.findMine(request.user.sub);
  }

  @Post()
  create(
    @Body() dto: CreateApplicationDto,
    @Req() request: AuthenticatedHttpRequest,
  ) {
    return this.applicationsService.create(dto, request.user.sub);
  }

  @Patch(':id/status')
  review(
    @Param('id') id: string,
    @Body() dto: ReviewApplicationDto,
    @Req() request: AuthenticatedHttpRequest,
  ) {
    return this.applicationsService.review(
      id,
      dto,
      request.user.sub,
      request.user.role,
    );
  }
}
