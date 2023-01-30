import { Test, TestingModule } from '@nestjs/testing';
import { JobApplicantsController } from './job-applicants.controller';

describe('JobApplicantsController', () => {
  let controller: JobApplicantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobApplicantsController],
    }).compile();

    controller = module.get<JobApplicantsController>(JobApplicantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
