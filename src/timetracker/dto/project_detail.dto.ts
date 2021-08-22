class TimeSlotDto {
    duration: number;
    time_start: Date;
}

export class ProjectDetailDto {
    timeslots: TimeSlotDto[];
    total_time: number;
    project: string
}
