import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CompanyAdminDto } from 'src/company-admin/dto/companyAdmin.dto';
import { CompanyAdmin } from 'src/company-admin/schema/company-admin.schema';
import { JobPost } from 'src/company-admin/schema/job-post-schema.schema';
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
    @Query() object: { companyId: string },
  ): Promise<CompanyAdmin[]> {
    return this.companyService.getAllCompanyAdmins(object.companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getJobPosts')
  async getJobPosts(
    @Query() object: { limit: number; skip: number },
  ): Promise<JobPost[]> {
    return this.companyService.getJobPosts(object.limit, object.skip);
  }
}
