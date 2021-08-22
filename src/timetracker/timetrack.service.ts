import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectDetailDto } from './dto/project_detail.dto';
import { ProjectTotalDto } from './dto/project_total.dto';
import { TimeSlot } from './timeslot.entity';

@Injectable()
export class TimeTrackService {

    constructor(@InjectRepository(TimeSlot) private repository: Repository<TimeSlot>){}

    findAll(): Promise<ProjectTotalDto[]> {
        return this.repository.createQueryBuilder()
            .select("project")
            .addSelect("SUM(duration)/60", "total_time") //convert to min
            .where("duration IS NOT NULL") //Ignore running timeslots
            .groupBy("project").getRawMany()
    }

    async findProject(project: string): Promise<ProjectDetailDto>{
        //Find all timeslots of project
        const timeslots = await this.repository.createQueryBuilder()
            .select("time_start")
            .addSelect("duration/60", "duration") //convert to min
            .where("duration IS NOT NULL") //Ignore running timeslots
            .andWhere("project = :pId", { pId: project })
            .getRawMany()
        // .find({select: ["time_start", "duration"], where: {project, duration: Not(IsNull())}})

        //Sum all timeslots duration
        const total_time = timeslots.reduce((total, timeslot) => total + timeslot.duration, 0)
        return {project, timeslots, total_time}
    }

    findRunningTimeSlot(projectName: string) {
        return this.repository.findOne({project: projectName, duration: null})
    }

    async startTimeSlot(projectName: string) {
        const timeslot = this.repository.create({project: projectName})
        return this.repository.save(timeslot)
    }

    async stopTimeSlot(startedTimeSlot: TimeSlot) {
        startedTimeSlot.duration = Math.floor((Date.now() - startedTimeSlot.time_start.getTime())/1000)
        return this.repository.save(startedTimeSlot)
    }

}
