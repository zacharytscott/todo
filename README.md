# Todo List
This is a simple todo app built on the MERN stack.

## Table of Contents
1.[How to build this app](#how-to-build-this-app)

## How to build this app
### Building and running the database
This app uses a MongoDB database. To make building this database a little easier, you can use [Docker](https://www.docker.com/). Docker lets us spin up a virtualized instance of MongoDB and prepopulate it with the collection we need for this app.

First, we build the docker image and give it a name of "todo_mongo". The build command must be run in this project's docker directory as it contains the Dockerfile.

```
docker build -t todo_mongo .
```
Next, we run a container using the image we just created. The command below exposes the default mongo port, 27017, so that it can be accessed on your machine at this port.
```
docker run -p 27017:27017 todo_mongo
```
If you don't want to use Docker, you will need to run an instance of MongoDB with a database named "todos" and a single collection called "todos".
### Building and running the Node.js server

Next, we need to build the server. Once you database is up and running, simply run the following two commands in the project's server directory:

```
npm install
npm start
```
You can check that the server is running by visiting http://localhost:3001 in your browser. If you want to point at a specific MongoDB instance other than the default, or if you want your server to run on a different port, you can modify the configuration file at {app root}/todo/server/config.json.
### Building and running the React app
Finally, we need to start up the React app. With the database and server running, execute the following two commands in the project's client directory:
```
yarn install
yarn start
```
This will start up react and open it in your browser. **If you are runnng your server at a different url than localhost:3001, you will need to modify the configuration file at {app root}/todo/client/src/config.json to specify the server you wish to point to**.
