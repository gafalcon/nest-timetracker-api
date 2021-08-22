import { Test } from '@nestjs/testing';
import { TimeTrackerController } from '../src/timetracker/timetracker.controller';
import { TimeTrackService } from '../src/timetracker/timetrack.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlot } from '../src/timetracker/timeslot.entity';

export const getTestingModule = () =>  (Test.createTestingModule({
    controllers: [TimeTrackerController],
    providers: [TimeTrackService],
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            entities: [TimeSlot],
            synchronize: true,
            keepConnectionAlive: true
        }),
        TypeOrmModule.forFeature([TimeSlot])],
}).compile());
