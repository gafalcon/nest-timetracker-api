import { Module } from '@nestjs/common';
import { TimeTrackerController } from './timetracker/timetracker.controller';
import { TimeTrackService } from './timetracker/timetrack.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlot } from './timetracker/timeslot.entity';

@Module({
    imports: [TypeOrmModule.forRoot(),
              TypeOrmModule.forFeature([TimeSlot])],
    controllers: [TimeTrackerController],
    providers: [TimeTrackService],
})
export class AppModule {}
