# TASK MANAGEMENT API

## Description

Task management API built with Nest JS and Typescript. This gives APIs from the authentication, authorization, down to the individual entity module.

## Dependencies

- [NestJS] (https://nestjs.com/)
- [Typescript] (https://www.typescriptlang.org/)
- [PostgreSQL] (https://www.postgresql.org/)
- [TypeORM] (https://typeorm.io/#/)

### How to run locally

### Clone the repository

- Run `git clone https://github.com/devugo/task-management-server` on your terminal/cmd to pull the project

### Install Dependencies

- Run `yarn install` or `npm install` in your project directory to download all dependencies

### Setup Database

- Ensure you have postgreSQL setup on your machine.
- Create a databse with the name `task-management` or use another name and do change the name on the `.env.stage.dev` file.
- Ensure your database credentails match what is contain i the `.env.stage.dev` file.

### Run the application

- Run `yarn start:dev` to start up local server to begin using the `TASK MANAGMENT API`.

Follow the documentation below to see the various endpoints

## DOCUMENTATION

### Documentation URL

- [docs](https://www.postman.com/collections/2fbb4c9c121f99bac6be).

### Authentication

### Signup

```http
POST /auth/signup
```

```
    {
        "email": "info@devugo.com",
        "username": "devugo",
        "password": "password,
    }
```

### Signin

- Once a user successfully logs in, a token is generated to be used for subsequent requests by that user.

```http
POST /auth/signin
```

```
    {
        "email": "info@devugo.com",
        "password": "password,
    }
```

### Retain

```http
GET /auth/retain
```

### TASKS

### Get all tasks

```http
GET /tasks?search=new&status=OPEN&project=2452e06e-fc0b-4e2f-8e9e-c66f91e480e3&label=2452e06e-fc0b-4e2f-8e9e-c66f91e480e3&page=1
```

| Parameter | Type      | Description       | Default |
| :-------- | :-------- | :---------------- | :------ |
| `status`  | `string`  | Task status       | null    |
| `project` | `string`  | Project ID        | null    |
| `label`   | `string`  | Label ID          | null    |
| `page`    | `integer` | Pagination number | 1       |

### Get a task

```http
GET /tasks/2452e06e-fc0b-4e2f-8e9e-c66f91e480e3
```

### Create a task

```http
POST /tasks
```

```
    {
        "title": "Task 1",
        "description": "Task 1 description,
        "project": "The project ID",
        "level": "The level ID",
        "label": "The label ID",
        "date": "The date to deliver the task",
    }
```

### Update a task

```http
PATCH /tasks/2452e06e-fc0b-4e2f-8e9e-c66f91e480e3
```

```
    {
        "title": "Task 1",
        "description": "Task 1 description,
        "project": "The project ID",
        "level": "The level ID",
        "label": "The label ID",
        "date": "The date to deliver the task",
    }
```

### Delete a task

```http
DELETE /tasks/2452e06e-fc0b-4e2f-8e9e-c66f91e480e3
```

### Summary of tasks

```http
GET /tasks/summary
```

## PROJECTS

Project API

### Get all projects

```http
GET /projects
```

### Get a single project

```http
GET /projects/2452e06e-fc0b-4e2f-8e9e-c66f91e480e3
```

### Create a project

```http
POST /projects
```

```
    {
        "title": "Task 1",
        "description": "Task 1 description,
        "color": "#fff"
    }
```

### Update a project

```http
PATCH /projects/2452e06e-fc0b-4e2f-8e9e-c66f91e480e3
```

```
    {
        "title": "Task 1",
        "description": "Task 1 description,
        "color": "#fff"
    }
```

### Delete a project

```http
DELETE /projects/2452e06e-fc0b-4e2f-8e9e-c66f91e480e3
```

## LABELS

Label API

### Get all labels

```http
GET /labels
```

### Get a single label

```http
GET /labels/2452e06e-fc0b-4e2f-8e9e-c66f91e480e3
```

### Create a label

```http
POST /labels
```

```
    {
        "title": "Task 1",
        "color": "#fff"
    }
```

### Update a label

```http
PATCH /labels/2452e06e-fc0b-4e2f-8e9e-c66f91e480e3
```

```
    {
        "title": "Task 1",
        "color": "#fff"
    }
```

### Delete a label

```http
DELETE /labels/2452e06e-fc0b-4e2f-8e9e-c66f91e480e3
```

## LEVELS

Level API

### Get all levels

```http
GET /levels
```

## Status Codes

This returns the following status codes in its API:

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 201         | `CREATED`               |
| 400         | `BAD REQUEST`           |
| 401         | `UNAUTHORIZED`          |
| 404         | `NOT FOUND`             |
| 500         | `INTERNAL SERVER ERROR` |
