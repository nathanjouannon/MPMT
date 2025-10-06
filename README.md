# MPMT
Tool for project management.

## Client 
### techno
- typeScript
- Angular
- Jest
- scss for styles
### Local start
to start locally only the frontend 

First install angular cli
```
npm i -g @angular/cli
```

Then install dependency
```
npm i
```
And start the server
```
ng serve
```
disponible at 'localhost:4200'


## Server
### techno
- Java
- Spring boot 
- Spring web
- Spring JPA
### Local start
To start locally only th e backend.

First install Java JDK 21
Then open the project with intelliJ
And run the main function
Backand server disponible at 'localhost:8080'

## Docker
To start the full project with db and database viewer (phpMyAdmin). Use the documentation ./DOCKER_README.md

## CI / CD
### Deployment procedure

This project uses GitHub Actions for continuous integration and deployment. The workflow automatically:

1. **Tests and builds the frontend and backend** when code is pushed or a pull request is made to the main branch
2. **Pushes Docker images to DockerHub** when code is merged into the main branch

#### Workflow Steps

- **Frontend Pipeline**:
  - Runs on Ubuntu latest
  - Sets up Node.js 18
  - Installs dependencies with `npm ci`
  - Runs unit tests with Chrome Headless
  - Builds the Angular application

- **Backend Pipeline**:
  - Runs on Ubuntu latest
  - Sets up Java JDK 21
  - Caches Maven dependencies
  - Builds the backend with Maven

- **Docker Deployment** (only on push to main):
  - Builds Docker images for both frontend and backend
  - Pushes images to DockerHub with tags:
    - `latest`
    - SHA of the commit

#### Setting up CI/CD

To set up the CI/CD pipeline for your own fork of this repository:

1. Create a DockerHub account if you don't have one
2. Create the following repository secrets in GitHub:
   - `DOCKERHUB_USERNAME`: Your DockerHub username
   - `DOCKERHUB_TOKEN`: A personal access token from DockerHub (not your password)
3. Push to the main branch to trigger the workflow

#### Manually triggering the workflow

You can manually trigger the workflow from the GitHub Actions tab in your repository.

#### Docker images

After a successful workflow run, Docker images will be available at:
- Frontend: `[your-dockerhub-username]/mpmt-client:latest`
- Backend: `[your-dockerhub-username]/mpmt-server:latest`

These images can be used for deployment to any environment that supports Docker containers.

