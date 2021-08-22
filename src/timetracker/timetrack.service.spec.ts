import { Test, TestingModule } from '@nestjs/testing';
import { TimeTrackService } from './timetrack.service';

describe('TimeTrackService', () => {
  let service: TimeTrackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeTrackService],
    }).compile();

    service = module.get<TimeTrackService>(TimeTrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
