import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { UserPostModule } from './user-post/user-post.module';
import { CompanyModule } from './company/company.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CompanyAdminModule } from './company-admin/company-admin.module';
import { JobApplicantsModule } from './job-applicants/job-applicants.module';
import { ChatModule } from './chat/chat.module';
import { VideoCallGateway } from './video-call/video-call.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_LOCAL_CONNECTION_URL),
    AuthModule,
    UserModule,
    UserPostModule,
    CompanyModule,
    AdminModule,
    CompanyAdminModule,
    JobApplicantsModule,
    ChatModule,
  ],
  controllers: [],
  providers: [VideoCallGateway],
})
export class AppModule {}
