import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';
import { JobApplicantsService } from '../service/job-applicants.service';

@Controller('jobApplicant')
export class JobApplicantsController {
  constructor(private jobApplicantService: JobApplicantsService) {}

  @Get('/applyForJob')
  async applyForJob(
    @Query() object: { jobId: string; userId: string },
  ): Promise<boolean> {
    return this.jobApplicantService.applyForJob(object.jobId, object.userId);
  }

  @Get('/getAllApplicants')
  async getAllApplicants(@Query() object: { jobId: string }): Promise<User[]> {
    return this.jobApplicantService.getAllApplicants(object.jobId);
  }

  @Get('/rejectApplicant')
  async rejectApplicant(
    @Query() object: { applicantId: string; jobId: string },
  ): Promise<boolean> {
    if (!object.applicantId)
      throw new HttpException('An Error occurred', HttpStatus.BAD_REQUEST);
    return this.jobApplicantService.rejectApplicant(
      object.applicantId,
      object.jobId,
    );
  }

  @Get('/acceptApplicant')
  async acceptApplicant(
    @Query() object: { applicantId: string; jobId: string },
  ): Promise<boolean> {
    if (!object.applicantId)
      throw new HttpException('An Error occurred', HttpStatus.BAD_REQUEST);
    return this.jobApplicantService.acceptApplicant(
      object.applicantId,
      object.jobId,
    );
  }

  @Post('/acceptApplicant')
  async acceptApplicantAndSchedule(
    @Body() formData: any,
    @Query() object: { jobId: string; applicantId: string; adminId: string },
  ): Promise<boolean> {
    if (!object.applicantId || !object.jobId || !object.adminId)
      throw new HttpException('An Error occurred', HttpStatus.BAD_REQUEST);
    return this.jobApplicantService.acceptApplicantAndSchedule(
      formData,
      object.applicantId,
      object.jobId,
      object.adminId,
    );
  }
}
