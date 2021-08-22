import { Controller, Get, Param, Post } from '@nestjs/common';
import { TimeTrackService } from './timetrack.service';

@Controller('projects')
export class TimeTrackerController {

    constructor(private timetrackService: TimeTrackService) {}

    @Get('')
    async findAll() {
        return this.timetrackService.findAll()
    }

    @Get(':project')
    async findProject(@Param('project') project: string){
        return {project}
    }

    @Post(':project/start')
    async startTime(@Param('project') project: string){
        return this.timetrackService.startTimeSlot(project)
    }

    @Post(':project/stop')
    async stopTime(@Param('project') project: string){
        const timeslot = await this.timetrackService.findRunningTimeSlot(project)
        return this.timetrackService.stopTimeSlot(timeslot)
    }

}
