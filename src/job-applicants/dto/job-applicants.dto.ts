import { IsNotEmpty } from 'class-validator';

export class JobApplicants {
  @IsNotEmpty()
  jobId: string;

  @IsNotEmpty()
  applicantId: string;

  @IsNotEmpty()
  companyId: string;

  accepted: boolean;

  online: object;
  offline: object;
  hired: object;
}
