import { TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { getTestingModule } from '../../test/createTestModule';
import { TimeTrackService } from './timetrack.service';
import { TimeTrackerController } from './timetracker.controller';

describe('TimetrackerController', () => {
    let controller: TimeTrackerController;
    let timetrackService: TimeTrackService;

    beforeEach(async () => {
        const module: TestingModule = await getTestingModule()
        controller = module.get<TimeTrackerController>(TimeTrackerController);
        timetrackService = module.get<TimeTrackService>(TimeTrackService);
    });


    describe('findAll', () => {
        it('should return array of timeslots', async () => {
            const result = []
            jest.spyOn(timetrackService, 'findAll').mockImplementation(() => new Promise((resolve) => resolve(result)));
            expect(await controller.findAll()).toBe(result);
        })
    })

    describe('findProject', () => {
        it('should return a project timeslots', async () => {
            const result = { projectId: {timeslots: [{timestart: "", duration: 0}], total_time: 0 }}
            jest.spyOn(timetrackService, 'findProject').mockImplementation((project:string) => {
                return new Promise((resolve) => resolve(result[project]))
            });
            expect(await controller.findProject('projectId')).toBe(result.projectId);
        })

        it('should throw 404 Exception if no timeslots found', async () => {
            const result = { projectId: {timeslots: [], total_time: 0 }}
            jest.spyOn(timetrackService, 'findProject').mockImplementation((project:string) => {
                return new Promise((resolve) => resolve(result[project]))
            });
            await expect(controller.findProject('projectId')).rejects.toThrow(HttpException)
        })
    })

    describe('start project timeslot', () => {
        it('should start new timeslot', async () => {
            const result = {projectId: {project: 'projectId', duration: null, 'id': 1, time_start: ""}}
            jest.spyOn(timetrackService, 'startTimeSlot').mockImplementation((project:string)=> {
                return new Promise((resolve) => resolve(result[project]))
            })
            jest.spyOn(timetrackService, 'findRunningTimeSlot').mockImplementation(() => {
                return new Promise((resolve) => resolve(undefined))
            })
            expect(await controller.startTime('projectId')).toBe(result.projectId)
        })

        it('should throw err if project already started', async () => {
            const result = {projectId: {project: 'projectId', duration: null, 'id': 1, time_start: ""}}
            jest.spyOn(timetrackService, 'startTimeSlot').mockImplementation((project:string)=> {
                return new Promise((resolve) => resolve(result[project]))
            })
            jest.spyOn(timetrackService, 'findRunningTimeSlot').mockImplementation((project) => {
                return new Promise((resolve) => resolve(result[project]))
            })
            await expect(controller.startTime('projectId')).rejects.toThrow(HttpException)
        })
    })

    describe('stop project timeslot', () => {
        it('should stop timeslot', async () => {
            const result = {projectId: {project: 'projectId', duration: null, 'id': 1, time_start: ""}}
            jest.spyOn(timetrackService, 'stopTimeSlot').mockImplementation((project)=> {
                project.duration = 100
                return new Promise((resolve) => resolve(project))
            })
            jest.spyOn(timetrackService, 'findRunningTimeSlot').mockImplementation((project) => {
                return new Promise((resolve) => resolve(result[project]))
            })
            expect(await controller.stopTime('projectId')).toBe(result.projectId)
        })

        it('should throw err if project already stopped', async () => {
            jest.spyOn(timetrackService, 'findRunningTimeSlot').mockImplementation((_) => {
                return new Promise((resolve) => resolve(undefined))
            })
            await expect(controller.stopTime('projectId')).rejects.toThrow(HttpException)
        })
    })
});
