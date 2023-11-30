# st-assessment

- assessment link: https://github.com/tqwdan82/Technical_Assessment



- contact:
    - email: lamkhacduy13@gmail.com 
    - linkedin: https://www.linkedin.com/in/khacduylam/

## Environment Requirements 

- Node(v16.16.0)
- Npm(v8.11)
- Docker(v24.0.2)
- Docker Compose(v2.19.1)

## Deployment 

## Server 

> NOTE: Server code is cloned from my existing repo: https://github.com/khacduylam/nestjs-starter/tree/typeorm-postgres. 
Included some unnecessary modules. Please focus on `feedbacks` module only.

```shell
# Go to `be` folder, copy content of `example.env` to `.env` 
$ cd be/ 
$ cp example.env .env

# Prepare an PostgreSQL DB instance
$ docker-compose up -d

# Start server(dev environment)
$ npm run start:dev

# Check if server is running 
$ curl http://localhost:{PORT}/health

>>> "Hello World!" indicates the server is started!

# Test
$ npm run test

```
> NOTE: For more details, see at `be/README.md`

## Web 

```shell
# Go to `fe` folder 
$ cd fe/ 

# Start web(dev evironment)
$ npm start
```

