import { ConflictException, Controller, Get, HttpException, NotFoundException, Param, Post } from '@nestjs/common';
import { ProjectDetailDto } from './dto/project_detail.dto';
import { ProjectTotalDto } from './dto/project_total.dto';
import { TimeSlot } from './timeslot.entity';
import { TimeTrackService } from './timetrack.service';

@Controller('projects')
export class TimeTrackerController {

    constructor(private timetrackService: TimeTrackService) {}

    @Get('')
    async findAll(): Promise<ProjectTotalDto[]> {
        return this.timetrackService.findAll()
    }

    @Get(':project')
    async findProject(@Param('project') project: string): Promise<ProjectDetailDto>{
        const projectDetail: ProjectDetailDto = await this.timetrackService.findProject(project)
        if (!projectDetail.timeslots.length)
            throw new NotFoundException('Project Not found')
        return projectDetail
    }

    @Post(':project/start')
    async startTime(@Param('project') project: string): Promise<TimeSlot>{
        const timeslot = await this.timetrackService.findRunningTimeSlot(project)
        if (timeslot)
            throw new ConflictException('Project already running')
        return this.timetrackService.startTimeSlot(project)
    }

    @Post(':project/stop')
    async stopTime(@Param('project') project: string): Promise<TimeSlot>{
        const timeslot = await this.timetrackService.findRunningTimeSlot(project)
        if (!timeslot)
            throw new ConflictException('Project not found or not running')
        return this.timetrackService.stopTimeSlot(timeslot)
    }
}
