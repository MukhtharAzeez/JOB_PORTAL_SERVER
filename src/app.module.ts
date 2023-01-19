/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { UserPostModule } from './user-post/user-post.module';
import { CompanyModule } from './company/company.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    MongooseModule.forRoot(process.env.MONGO_LOCAL_CONNECTION_URL),
    AuthModule,
    UserModule,
    UserPostModule,
    CompanyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
