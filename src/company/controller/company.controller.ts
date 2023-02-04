import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CompanyAdminDto } from 'src/company-admin/dto/companyAdmin.dto';
import { CompanyAdmin } from 'src/company-admin/schema/company-admin.schema';
import { JobPost } from 'src/company-admin/schema/job-post-schema.schema';
import { CompanyRequests } from 'src/requests/schema/companyRequests';
import { CompanyService } from '../service/company.service';

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/addAdmin')
  async addAdmin(
    @Body()
    companyAdminDto: CompanyAdminDto,
  ): Promise<CompanyAdmin> {
    return this.companyService.addAdmin(companyAdminDto);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('/getAllCompanyAdmins')
  async getAllCompanyAdmins(
    @Query() object: { companyId: string; skip: number; limit: number },
  ): Promise<CompanyAdmin[]> {
    return this.companyService.getAllCompanyAdmins(
      object.companyId,
      object.limit,
      object.skip,
    );
  }

  @Get('/getCountCompanyAdmins')
  async getCountCompanyAdmins(
    @Query() object: { companyId: string },
  ): Promise<number> {
    return this.companyService.getCountCompanyAdmins(object.companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getJobPosts')
  async getJobPosts(
    @Query() object: { limit: number; skip: number },
  ): Promise<JobPost[]> {
    return this.companyService.getJobPosts(object.limit, object.skip);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getAllRequests')
  async getAllRequests(
    @Query() object: { companyId },
  ): Promise<CompanyRequests[]> {
    return this.companyService.getAllRequests(object.companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/acceptSchedule')
  async acceptSchedule(
    @Body()
    object: {
      companyRequestId: string;
    },
  ): Promise<boolean> {
    return this.companyService.acceptSchedule(object.companyRequestId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/rejectSchedule')
  async rejectSchedule(
    @Body()
    object: {
      companyRequestId: string;
    },
  ): Promise<boolean> {
    return this.companyService.rejectSchedule(object.companyRequestId);
  }
}
