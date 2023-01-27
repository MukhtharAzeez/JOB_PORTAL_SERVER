import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async addAJobPost(addAJobPost: AddAJobPost): Promise<JobPost> {
    return this.companyAdminRepository.addAJobPost(addAJobPost);
  }

  async editAJob(addAJobPost: AddAJobPost): Promise<JobPost> {
    return this.companyAdminRepository.editAJob(addAJobPost);
  }

  async getAllCompanyPosts(companyId: string): Promise<JobPost[]> {
    return this.companyAdminRepository.getAllCompanyPosts(companyId);
  }

  async getAJobPost(jobId: string, user: boolean): Promise<JobPost[]> {
    return this.companyAdminRepository.getAJobPost(jobId, user);
  }

  async rejectApplicant(applicantId: string, jobId: string): Promise<boolean> {
    return this.companyAdminRepository.rejectApplicant(applicantId, jobId);
  }

  async acceptApplicant(applicantId: string, jobId: string): Promise<boolean> {
    return this.companyAdminRepository.acceptApplicant(applicantId, jobId);
  }
}
