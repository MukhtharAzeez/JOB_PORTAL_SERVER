import { Injectable } from '@nestjs/common';
import { Company } from 'src/company/schema/company.schema';
import { AdminRepository } from '../repository/admin.repository';

@Injectable()
export class AdminService {
  constructor(private adminRepository: AdminRepository) {}

  async getAllCompanies(limit: number, skip: number): Promise<Company[]> {
    return this.adminRepository.getAllCompanies(limit, skip);
  }

  async getCountCompanies(): Promise<number> {
    return this.adminRepository.getCountCompanies();
  }

  async approveCompany(companyId): Promise<boolean> {
    return this.adminRepository.approveCompany(companyId);
  }

  async getCompanyDetails(companyId): Promise<Company> {
    return this.adminRepository.getCompanyDetails(companyId);
  }
}
