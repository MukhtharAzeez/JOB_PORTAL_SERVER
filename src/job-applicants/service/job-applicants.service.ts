import { User } from './../../user/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { JobApplicantRepository } from '../repository/job-applicants.repository';

@Injectable()
export class JobApplicantsService {
  constructor(private jobApplicantRepository: JobApplicantRepository) {}

  async applyForJob(jobId: string, userId: string): Promise<boolean> {
    return this.jobApplicantRepository.applyForJob(jobId, userId);
  }

  async getAllApplicants(jobId: string): Promise<User[]> {
    return this.jobApplicantRepository.getAllApplicants(jobId);
  }

  async rejectApplicant(applicantId: string, jobId: string): Promise<boolean> {
    return this.jobApplicantRepository.rejectApplicant(applicantId, jobId);
  }

  async acceptApplicant(applicantId: string, jobId: string): Promise<boolean> {
    return this.jobApplicantRepository.acceptApplicant(applicantId, jobId);
  }

  async acceptApplicantAndSchedule(
    formData: any,
    applicantId: string,
    jobId: string,
    adminId: string,
  ): Promise<boolean> {
    return this.jobApplicantRepository.acceptApplicantAndSchedule(
      formData,
      applicantId,
      jobId,
      adminId,
    );
  }
}
