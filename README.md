
# NestJS Project Time Tracker

## Description

  REST-ful API that allows to start and stop a timer to track time spent in different projects.
  
 Written using the [Nest](https://github.com/nestjs/nest) framework in Typescript. Uses a Sqlite Db for persistence.

## Installation

```bash
$ yarn install
```
or
```bash
$ npm install
```
## Running the app

```bash
# development
$ yarn run start
or
$ npm run start

# watch mode
$ yarn run start:dev
or
$ npm run start:dev

```


## API Endpoints Implemented
### Get /projects
Report the list of projects and total time in minutes for every project

Sample json response:
```json
[
 {"project": "projectName1", total_time: 10},
 {"project": "projectName2", total_time: 14}
]
```

### Get /projects/:project
Reports the total time and list the individual time slots for a project

Sample json response: /projects/test
```json
{
    "project": "test",
    "timeslots": [
        {
            "time_start": "2021-08-22 02:47:42",
            "duration": 88
        },
        {
            "time_start": "2021-08-22 04:19:47",
            "duration": 4
        }
    ],
    "total_time": 92
}
```

### POST /projects/:project/start
Starts the timer for project XYZ

Sample json response: /projects/test/start
```json
{
    "project": "start",
    "duration": null,
    "id": 2,
    "time_start": "2021-08-22T04:19:47.000Z"
}
```

Returns CONFLICT_ERROR(409)  if Project has a time slot running.
```json
{
    "statusCode": 409,
    "message": "Project already running",
    "error": "Conflict"
}
```

### POST /projects/:project/stop
Stops the timer for project

Sample json response: /projects/test/stop
```json
{
    "id": 2,
    "project": "test",
    "time_start": "2021-08-22T04:19:47.000Z",
    "duration": 292
}
```
Returns CONFLICT_ERROR(409)  if cannot find running time slot for project.
```json
{
    "statusCode": 409,
    "message": "Project not found or not running",
    "error": "Conflict"
}
```

## Test
First, I implemented unit testing for each method in the timetrack controller, mocking the service that interacts with the db.

At the end, created end-2-end testing to validate each endpoint. Uses in memory sqlite db for testing.


```bash
# unit tests
$ npm run test

or

$ yarn run test
# e2e tests
$ npm run test:e2e

or

$ yarn run test:e2e
```
