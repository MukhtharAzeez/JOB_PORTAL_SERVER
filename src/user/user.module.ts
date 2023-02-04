import {
  JobPost,
  JobPostSchema,
} from './../company-admin/schema/job-post-schema.schema';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { JwtModule } from '@nestjs/jwt/dist';
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
      { name: User.name, schema: UserSchema },
      { name: JobPost.name, schema: JobPostSchema },
      { name: UserRequests.name, schema: UserRequestsSchema },
      { name: CompanyAdminRequests.name, schema: CompanyAdminRequestsSchema },
    ]),
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
