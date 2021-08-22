import { Test, TestingModule } from '@nestjs/testing';
import { getTestingModule } from '../../test/createTestModule';
import { TimeTrackService } from './timetrack.service';

describe('TimeTrackService', () => {
  let service: TimeTrackService;

  beforeEach(async () => {
      const module: TestingModule = await getTestingModule()
    service = module.get<TimeTrackService>(TimeTrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
