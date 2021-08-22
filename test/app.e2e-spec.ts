import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getTestingModule } from './createTestModule';
import { Repository } from 'typeorm';
import { TimeSlot } from 'src/timetracker/timeslot.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
    let repository: Repository<TimeSlot>;
  beforeEach(async () => {
      const module: TestingModule = await getTestingModule()
      repository = module.get('TimeSlotRepository');
      app = module.createNestApplication();
      await app.init();
  });

    afterAll(async () => {
        await app.close();
    });

    afterEach(async () => {
        await repository.query(`DELETE FROM time_slot;`);
    });


    describe('GET /projects', () => {
        it('list all projects with correct accumulated total time', async () => {
            //Create sample timeslots
            await repository.save([
                { project: 'project0', duration: 6 },
                { project: 'project0', duration: 12 },
                { project: 'project1', duration: 18 },
                { project: 'project1', duration: null },
                { project: 'project2', duration: 12 },
                { project: 'project2', duration: 24 },
            ]);
            return request(app.getHttpServer())
                .get('/projects')
                .expect(200)
                .expect([
                    { project: 'project0', total_time: 18 },
                    { project: 'project1', total_time: 18 },
                    { project: 'project2', total_time: 36 }
                ])
        });
    });


    describe('GET /project/:projectId', () => {

        it('should return 404 if not found', () => {
            return request(app.getHttpServer())
                .get('/projects/projectId')
                .expect(404)
        })

        it('should return correct total time and timeslots for project', async () => {
            await repository.save([
                { project: 'project0', duration: 6 },
                { project: 'project0', duration: 12 },
                { project: 'project0', duration: 18 },
                { project: 'project0', duration: null },
            ]);

            const {body} = await request(app.getHttpServer())
                .get('/projects/project0')
                .expect(200)

            expect(body.total_time).toBe(36)
            expect(body.timeslots).toHaveLength(3)
            body.timeslots.forEach((timeslot:object) => {
                expect(timeslot).toHaveProperty('duration')
                expect(timeslot).toHaveProperty('time_start')
            })
        })
    })

    describe('POST /projects/:projectId/start', () => {

        it('should start a project', async () => {
            const {body} = await request(app.getHttpServer())
                .post('/projects/test/start') //start test project
                .expect(201)
            expect(body.project).toBe('test')
            expect(body.duration).toBe(null)
            expect(body).toHaveProperty('time_start')
        })

        it('should return 409 if project has running timeslot', async () => {
            const server = app.getHttpServer()
            await request(server) //First start
                .post('/projects/test/start')
            return request(server) //2nd start
                .post('/projects/test/start')
                .expect(409)
        })

    })

    describe('POST /projects/:projectId/stop', () => {
        it('should return 409 if cannot find running project', () => {
            return request(app.getHttpServer())
                .post('/projects/projectId/stop')
                .expect(409)
        })

        it('should stop running project', async () => {
            const server = app.getHttpServer()
            await request(server) //First start
                .post('/projects/test/start')
            const {body} = await request(server) //2nd start
                .post('/projects/test/stop')
                .expect(201)

            expect(body.duration).not.toBe(null)
            expect(body.project).toBe('test')
            expect(body).toHaveProperty('time_start')
        })

        it('should have correct duration when stopped', async () => {
            //Create timeslot with start time 60 seconds before now
            await repository.save([
                { project: 'test', time_start: new Date(Date.now() - 60000) },
            ]);

            const {body} = await request(app.getHttpServer())
                .post('/projects/test/stop')
                .expect(201)

            expect(body.duration).toBe(1)
            expect(body.project).toBe('test')
        })

        it('should be in list of projects when stopped', async () => {
            const server = app.getHttpServer()
            await request(server) //start
                .post('/projects/test/start')
            await request(server) //stop
                .post('/projects/test/stop')
                .expect(201)

            const { body } = await request(server)
                .get('/projects')
                .expect(200)
            const projects = body.filter((project:any) => project.project === "test")
            expect(projects).toHaveLength(1)
            expect(projects[0].total_time).toBe(0)
        })
    })
});
