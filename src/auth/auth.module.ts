import {
  CompanyAdmin,
  CompanyAdminSchema,
} from './../company-admin/schema/company-admin.schema';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { AuthRepository } from './auth.repository';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from 'src/company/schema/company.schema';
import { Admin, AdminSchema } from 'src/admin/schema/admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
      { name: CompanyAdmin.name, schema: CompanyAdminSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy],
})
export class AuthModule {}
