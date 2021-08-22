import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTotalDto } from './dto/project_total.dto';
import { TimeSlot } from './timeslot.entity';

@Injectable()
export class TimeTrackService {

    constructor(@InjectRepository(TimeSlot) private repository: Repository<TimeSlot>){}

    findAll(): Promise<ProjectTotalDto[]> {
        return this.repository.createQueryBuilder()
            .select("project")
            .addSelect("SUM(duration)/60", "total_time")
            .where("duration IS NOT NULL")
            .groupBy("project").getRawMany()
    }

    async findProject(projectName: string){

    }

    findRunningTimeSlot(projectName: string) {
        return this.repository.findOne({project: projectName, duration: null})
    }

    async startTimeSlot(projectName: string) {
        const timeslot = this.repository.create({project: projectName})
        return this.repository.save(timeslot)
    }

    async stopTimeSlot(startedTimeSlot: TimeSlot) {
        startedTimeSlot.duration = (Date.now() - startedTimeSlot.time_start.getTime())/1000
        return this.repository.save(startedTimeSlot)
    }

}
