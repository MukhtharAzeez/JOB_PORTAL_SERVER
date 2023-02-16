import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JobApplicant } from 'src/job-applicants/schema/job-applicants.schema';
import { CompanyAdminRequests } from 'src/requests/schema/companyAdminRequests';
import { User } from 'src/user/schemas/user.schema';
import { AddAJobPost } from '../dto/addAJobPost.dto';
import { CompanyAdminRepository } from '../repository/company-admin.repository';
import { CompanyAdmin } from '../schema/company-admin.schema';
import { JobPost } from '../schema/job-post-schema.schema';

@Injectable()
export class CompanyAdminService {
  constructor(private companyAdminRepository: CompanyAdminRepository) {}
  async getProfile(adminId: string): Promise<CompanyAdmin> {
    if (!adminId)
      throw new HttpException('An Error occurred', HttpStatus.BAD_REQUEST);
    return this.companyAdminRepository.getProfile(adminId);
  }

  async addAJobPost(addAJobPost: AddAJobPost): Promise<boolean> {
    return this.companyAdminRepository.addAJobPost(addAJobPost);
  }

  async editAJob(addAJobPost: AddAJobPost): Promise<boolean> {
    return this.companyAdminRepository.editAJob(addAJobPost);
  }

  async getAllCompanyPosts(companyId: string): Promise<JobPost[]> {
    return this.companyAdminRepository.getAllCompanyPosts(companyId);
  }

  async getAJobPost(jobId: string): Promise<JobPost[]> {
    return this.companyAdminRepository.getAJobPost(jobId);
  }

  async getCompanyAdminRequests(
    companyAdminId: string,
  ): Promise<CompanyAdminRequests[]> {
    return this.companyAdminRepository.getCompanyAdminRequests(companyAdminId);
  }

  async updateRequest(requestId: string): Promise<boolean> {
    return this.companyAdminRepository.updateRequest(requestId);
  }

  async getPendingSchedules(
    userId: string,
    month: number,
    year: number,
  ): Promise<JobApplicant[]> {
    return this.companyAdminRepository.getPendingSchedules(userId, month, year);
  }

  async getRandomUser(): Promise<User[]> {
    return this.companyAdminRepository.getRandomUser();
  }
}
