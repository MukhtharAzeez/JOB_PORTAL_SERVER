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
import { AddAJobPost } from '../dto/addAJobPost.dto';
import { AuthGuard } from '@nestjs/passport';
import { CompanyAdminRequests } from 'src/requests/schema/companyAdminRequests';

@Controller('companyAdmin')
export class CompanyAdminController {
  constructor(private companyAdminService: CompanyAdminService) {}

  @UseGuards(AuthGuard('jwt'))
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
  async addAJobPost(@Body() addAJobPost: AddAJobPost): Promise<JobPost> {
    return this.companyAdminService.addAJobPost(addAJobPost);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/editAJob')
  async editAJob(@Body() addAJobPost: AddAJobPost): Promise<JobPost> {
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
}
