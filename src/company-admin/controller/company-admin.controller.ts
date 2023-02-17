import { JobPost } from './../schema/job-post-schema.schema';
import { CompanyAdmin } from 'src/company-admin/schema/company-admin.schema';
import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Post,
  Body,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CompanyAdminService } from '../service/company-admin.service';
import { AuthGuard } from '@nestjs/passport';
import { CompanyAdminRequests } from 'src/requests/schema/companyAdminRequests';
import { JobApplicant } from 'src/job-applicants/schema/job-applicants.schema';
import { User } from 'src/user/schemas/user.schema';
// import { AddAJobPost } from '../dto/addAJobPost.dto';

@Controller('companyAdmin')
export class CompanyAdminController {
  constructor(private companyAdminService: CompanyAdminService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async getProfile(
    @Query() object: { adminId: string },
  ): Promise<CompanyAdmin> {
    if (object.adminId == 'undefined' || !object.adminId)
      throw new HttpException('An Error occurred', HttpStatus.BAD_REQUEST);
    return this.companyAdminService.getProfile(object.adminId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/postJob')
  async addAJobPost(@Body() addAJobPost: any): Promise<boolean> {
    return this.companyAdminService.addAJobPost(addAJobPost);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/editAJob')
  async editAJob(@Body() addAJobPost: any): Promise<boolean> {
    return this.companyAdminService.editAJob(addAJobPost);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getAllCompanyPosts')
  async getAllCompanyPosts(
    @Query() object: { companyId: string },
  ): Promise<JobPost[]> {
    if (!object.companyId || object.companyId == 'undefined')
      throw new HttpException('An Error occurred', HttpStatus.BAD_REQUEST);
    return this.companyAdminService.getAllCompanyPosts(object.companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getAJobPost')
  async getAJobPost(@Query() object: { jobId: string }): Promise<JobPost[]> {
    if (!object.jobId || object.jobId == 'undefined')
      throw new HttpException('An Error occurred', HttpStatus.BAD_REQUEST);
    return this.companyAdminService.getAJobPost(object.jobId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getCompanyAdminRequests')
  async getCompanyAdminRequests(
    @Query() object: { companyAdminId: string },
  ): Promise<CompanyAdminRequests[]> {
    if (!object.companyAdminId || object.companyAdminId == 'undefined')
      throw new HttpException('An Error occurred', HttpStatus.CONFLICT);
    return this.companyAdminService.getCompanyAdminRequests(
      object.companyAdminId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/updateRequest')
  async updateRequest(
    @Query() object: { requestId: string },
  ): Promise<boolean> {
    if (!object.requestId || object.requestId == 'undefined')
      throw new HttpException('An Error occurred', HttpStatus.CONFLICT);
    return this.companyAdminService.updateRequest(object.requestId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getPendingSchedules')
  async getPendingSchedules(
    @Query() object: { companyId: string; date: Date },
  ): Promise<JobApplicant[]> {
    if (!object.companyId || object.companyId == 'undefined' || !object.date)
      throw new HttpException('An Error occurred', HttpStatus.CONFLICT);
    const month = new Date(object.date).getMonth() + 1;
    const year = new Date(object.date).getFullYear();
    return this.companyAdminService.getPendingSchedules(
      object.companyId,
      month,
      year,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getRandomUser')
  async getRandomUser(): Promise<User[]> {
    return this.companyAdminService.getRandomUser();
  }
}
