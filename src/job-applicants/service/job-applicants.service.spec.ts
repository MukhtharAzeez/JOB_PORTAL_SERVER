import { Test, TestingModule } from '@nestjs/testing';
import { JobApplicantsService } from './job-applicants.service';

describe('JobApplicantsService', () => {
  let service: JobApplicantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobApplicantsService],
    }).compile();

    service = module.get<JobApplicantsService>(JobApplicantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
