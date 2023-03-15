import { Controller, Get, Query, Patch, UseGuards } from '@nestjs/common';
import { BadGatewayException } from '@nestjs/common/exceptions';
import { AuthGuard } from '@nestjs/passport';
import { Company } from 'src/company/schema/company.schema';
import { AdminService } from '../service/admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/getAllCompanies')
  async getAllCompanies(
    @Query() object: { skip: number; limit: number },
  ): Promise<Company[]> {
    return this.adminService.getAllCompanies(object.limit, object.skip);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getCountCompanies')
  async getCountCompanies(): Promise<number> {
    return this.adminService.getCountCompanies();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/approveCompany')
  async approveCompany(
    @Query() object: { companyId: string },
  ): Promise<boolean> {
    return this.adminService.approveCompany(object.companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getCompanyDetails')
  async getCompanyDetails(
    @Query() object: { companyId: string },
  ): Promise<Company> {
    if (!object.companyId)
      throw new BadGatewayException('Check is there is any issues');
    return this.adminService.getCompanyDetails(object.companyId);
  }
}
