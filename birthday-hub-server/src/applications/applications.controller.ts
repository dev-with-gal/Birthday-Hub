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
import type { AuthenticatedHttpRequest } from '../auth/auth.types.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApplicationsService } from './applications.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { ReviewApplicationDto } from './dto/review-application.dto.js';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.applicationsService.findAll();
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  findMine(@Req() request: AuthenticatedHttpRequest) {
    return this.applicationsService.findMine(request.user.sub);
  }

  @Get('approved')
  findApproved() {
    return this.applicationsService.findApproved();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateApplicationDto,
    @Req() request: AuthenticatedHttpRequest,
  ) {
    return this.applicationsService.create(dto, request.user.sub);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
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
