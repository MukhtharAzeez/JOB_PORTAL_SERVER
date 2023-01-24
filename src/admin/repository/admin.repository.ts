import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from 'src/company/schema/company.schema';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async getAllCompanies(): Promise<Company[]> {
    return this.companyModel.find({});
  }

  async approveCompany(companyId): Promise<boolean> {
    const company = await this.companyModel.findOne({ _id: companyId });
    const approved = company.approved;
    await this.companyModel.updateOne(
      { _id: companyId },
      {
        $set: {
          approved: !approved,
        },
      },
    );
    return true;
  }

  async getCompanyDetails(companyId): Promise<Company> {
    return this.companyModel.findOne({ _id: companyId });
  }
}
