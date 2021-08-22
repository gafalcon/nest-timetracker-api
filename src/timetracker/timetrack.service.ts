import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlot } from './timeslot.entity';

@Injectable()
export class TimeTrackService {

    constructor(@InjectRepository(TimeSlot) private repository: Repository<TimeSlot>){}

    findAll() {
        return this.repository.find()
    }

    async findProject(project: string){

    }

    findRunningTimeSlot(projectName: string) {
        return this.repository.findOne({project: projectName, duration: null})
    }

    async createTimeSlot(projectName: string) {
    }

    async stopTimeSlot(startedTimeSlot: TimeSlot) {
    }

}
