import { JobApplicant, JobApplicantsSchema } from 'src/job-applicants/schema/job-applicants.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CompanyAdminRequests,
  CompanyAdminRequestsSchema,
} from 'src/requests/schema/companyAdminRequests';
import { CompanyAdminController } from './controller/company-admin.controller';
import { CompanyAdminRepository } from './repository/company-admin.repository';
import {
  CompanyAdmin,
  CompanyAdminSchema,
} from './schema/company-admin.schema';
import { JobPost, JobPostSchema } from './schema/job-post-schema.schema';
import { CompanyAdminService } from './service/company-admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobPost.name, schema: JobPostSchema },
      { name: CompanyAdmin.name, schema: CompanyAdminSchema },
      { name: CompanyAdminRequests.name, schema: CompanyAdminRequestsSchema },
      { name: JobApplicant.name, schema: JobApplicantsSchema },
    ]),
  ],
  controllers: [CompanyAdminController],
  providers: [CompanyAdminService, CompanyAdminRepository],
})
export class CompanyAdminModule {}
