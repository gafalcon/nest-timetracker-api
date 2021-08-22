import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('projects')
export class TimeTrackerController {


    @Get('')
    async findAll() {
        return []
    }

    @Get(':project')
    async findProject(@Param('project') project: string){
        return {project}
    }

    @Post(':project/start')
    async startTime(@Param('project') project: string){
        return {project, status: 'start'}
    }

    @Post(':project/stop')
    async stopTime(@Param('project') project: string){
        return {project, status: 'stop'}
    }

}
