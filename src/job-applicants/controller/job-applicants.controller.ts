import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/schemas/user.schema';
import { JobApplicant } from '../schema/job-applicants.schema';
import { JobApplicantsService } from '../service/job-applicants.service';

@Controller('jobApplicant')
export class JobApplicantsController {
  constructor(private jobApplicantService: JobApplicantsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/applyForJob')
  async applyForJob(
    @Query() object: { companyId: string; jobId: string; userId: string },
  ): Promise<boolean> {
    if (
      !object.jobId ||
      object.jobId == 'undefined' ||
      !object.userId ||
      object.userId == 'undefined' ||
      !object.companyId ||
      object.companyId == 'undefined'
    )
      throw new HttpException('An Error occurred', HttpStatus.BAD_REQUEST);
    return this.jobApplicantService.applyForJob(
      object.companyId,
      object.jobId,
      object.userId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getAllApplicants')
  async getAllApplicants(@Query() object: { jobId: string }): Promise<User[]> {
    if (object.jobId == 'undefined' || !object.jobId)
      throw new HttpException('An Error Occurred', HttpStatus.BAD_REQUEST);
    return this.jobApplicantService.getAllApplicants(object.jobId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/rejectApplicant')
  async rejectApplicant(
    @Query() object: { applicantId: string; jobId: string },
  ): Promise<boolean> {
    if (
      !object.jobId ||
      object.jobId == 'undefined' ||
      !object.applicantId ||
      object.applicantId == 'undefined'
    )
      throw new HttpException('An Error occurred', HttpStatus.BAD_REQUEST);
    return this.jobApplicantService.rejectApplicant(
      object.applicantId,
      object.jobId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/acceptApplicant')
  async acceptApplicant(
    @Query() object: { applicantId: string; jobId: string },
  ): Promise<boolean> {
    if (
      !object.jobId ||
      object.jobId == 'undefined' ||
      !object.applicantId ||
      object.applicantId == 'undefined'
    )
      throw new HttpException('An Error occurred', HttpStatus.BAD_REQUEST);
    return this.jobApplicantService.acceptApplicant(
      object.applicantId,
      object.jobId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/acceptApplicant')
  async acceptApplicantAndSchedule(
    @Body() formData: any,
    @Query()
    object: {
      jobId: string;
      applicantId: string;
      adminId: string;
      companyId: string;
    },
  ): Promise<boolean> {
    if (
      !object.jobId ||
      object.jobId == 'undefined' ||
      !object.applicantId ||
      object.applicantId == 'undefined' ||
      !object.applicantId ||
      object.applicantId == 'undefined' ||
      !object.companyId ||
      object.companyId == 'undefined'
    )
      throw new HttpException('An Error occurred', HttpStatus.BAD_REQUEST);
    return this.jobApplicantService.acceptApplicantAndSchedule(
      formData,
      object.applicantId,
      object.jobId,
      object.adminId,
      object.companyId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getAnApplicantSchedules')
  async getAnApplicantSchedules(
    @Query() object: { jobId: string; applicantId: string },
  ): Promise<JobApplicant> {
    if (
      !object.jobId ||
      object.jobId == 'undefined' ||
      !object.applicantId ||
      object.applicantId == 'undefined'
    )
      throw new HttpException('An Error occurred', HttpStatus.CONFLICT);
    return this.jobApplicantService.getAnApplicantSchedules(
      object.jobId,
      object.applicantId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/setAScheduleAsCompleted')
  async setAScheduleAsCompleted(
    @Query() object: { jobId: string; applicantId: string; type: string },
  ): Promise<boolean> {
    if (
      !object.jobId ||
      object.jobId == 'undefined' ||
      !object.applicantId ||
      object.applicantId == 'undefined' ||
      !object.type ||
      object.type == 'undefined'
    )
      throw new HttpException('An Error occurred', HttpStatus.CONFLICT);
    return this.jobApplicantService.setAScheduleAsCompleted(
      object.jobId,
      object.applicantId,
      object.type,
    );
  }

  @Get('/getCountAppliedJobs')
  async getCountAppliedJobs(): Promise<number> {
    return this.jobApplicantService.getCountAppliedJobs();
  }

  @Get('/getAllAppliedJobs')
  async getAllAppliedJobs(
    @Query() object: { userId: string; skip: number; limit: number },
  ): Promise<JobApplicant[]> {
    return this.jobApplicantService.getAllAppliedJobs(
      object.userId,
      object.limit,
      object.skip,
    );
  }
}
