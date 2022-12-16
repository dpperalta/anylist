<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Development Environment
1. Clone the project
2. Copy ```env.template``` and rename to ```env```
3. Execute
```
npm install
```
4. Raise up the docker image in detached mode (please ensure that Docker Desktop is running)
```
docker-compose up -d
```
5. Execute the nest backend with the command
```
npm run start:dev
```
6. Visit the site
```
http://localhost:3000/graphql
```