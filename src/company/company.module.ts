import {
  JobApplicant,
  JobApplicantsSchema,
} from './../job-applicants/schema/job-applicants.schema';
import {
  CompanyRequests,
  CompanyRequestsSchema,
} from 'src/requests/schema/companyRequests';
import {
  JobPost,
  JobPostSchema,
} from './../company-admin/schema/job-post-schema.schema';
import { CompanyRepository } from './repository/company.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyController } from './controller/company.controller';
import { Company, CompanySchema } from './schema/company.schema';
import { CompanyService } from './service/company.service';
import {
  CompanyAdmin,
  CompanyAdminSchema,
} from 'src/company-admin/schema/company-admin.schema';
import {
  UserRequests,
  UserRequestsSchema,
} from 'src/requests/schema/userRequests.schema';
import {
  CompanyAdminRequests,
  CompanyAdminRequestsSchema,
} from 'src/requests/schema/companyAdminRequests';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: CompanyAdmin.name, schema: CompanyAdminSchema },
      { name: JobPost.name, schema: JobPostSchema },
      { name: CompanyRequests.name, schema: CompanyRequestsSchema },
      { name: JobApplicant.name, schema: JobApplicantsSchema },
      { name: UserRequests.name, schema: UserRequestsSchema },
      { name: CompanyAdminRequests.name, schema: CompanyAdminRequestsSchema },
    ]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository],
})
export class CompanyModule {}
