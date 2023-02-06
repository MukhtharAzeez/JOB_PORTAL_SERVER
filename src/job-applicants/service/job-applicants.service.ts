import { User } from './../../user/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { JobApplicantRepository } from '../repository/job-applicants.repository';
import { JobApplicant } from '../schema/job-applicants.schema';

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
    companyId: string,
  ): Promise<boolean> {
    return this.jobApplicantRepository.acceptApplicantAndSchedule(
      formData,
      applicantId,
      jobId,
      adminId,
      companyId,
    );
  }

  async getAnApplicantSchedules(
    jobId: string,
    applicantId: string,
  ): Promise<JobApplicant> {
    return this.jobApplicantRepository.getAnApplicantSchedules(
      jobId,
      applicantId,
    );
  }

  async setAScheduleAsCompleted(
    jobId: string,
    applicantId: string,
    type: string,
  ): Promise<boolean> {
    return this.jobApplicantRepository.setAScheduleAsCompleted(
      jobId,
      applicantId,
      type,
    );
  }
}
