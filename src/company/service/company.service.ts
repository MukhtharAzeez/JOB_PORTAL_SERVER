import { Injectable } from '@nestjs/common';
import { CompanyAdminDto } from 'src/company-admin/dto/companyAdmin.dto';
import { CompanyAdmin } from 'src/company-admin/schema/company-admin.schema';
import { JobPost } from 'src/company-admin/schema/job-post-schema.schema';
import { CompanyRequests } from 'src/requests/schema/companyRequests';
import { CompanyRepository } from '../repository/company.repository';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async addAdmin(companyAdminDto: CompanyAdminDto): Promise<CompanyAdmin> {
    return this.companyRepository.addAdmin(companyAdminDto);
  }

  async getAllCompanyAdmins(
    companyId: string,
    limit: number,
    skip: number,
  ): Promise<CompanyAdmin[]> {
    return this.companyRepository.getAllCompanyAdmins(companyId, limit, skip);
  }

  async getCountCompanyAdmins(companyId: string): Promise<number> {
    return this.companyRepository.getCountCompanyAdmins(companyId);
  }

  async getJobPosts(limit: number, skip: number): Promise<JobPost[]> {
    return this.companyRepository.getJobPosts(limit, skip);
  }

  async getAllRequests(companyId): Promise<CompanyRequests[]> {
    return this.companyRepository.getAllRequests(companyId);
  }

  async acceptSchedule(companyRequestId: string): Promise<boolean> {
    return this.companyRepository.acceptSchedule(companyRequestId);
  }

  async rejectSchedule(companyRequestId: string): Promise<boolean> {
    return this.companyRepository.rejectSchedule(companyRequestId);
  }
}
