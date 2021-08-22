import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimeTrackerController } from './timetracker/timetracker.controller';

@Module({
  imports: [],
  controllers: [AppController, TimeTrackerController],
  providers: [AppService],
})
export class AppModule {}
