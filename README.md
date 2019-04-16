# Todo List <sup>✅</sup>
This is a simple todo app built on the MERN stack.

<div align="middle">
<img src="https://github.com/zacharytscott/todo/blob/master/img/main.PNG" title="The Todo List app" width="35%"/>
</div>

## Table of Contents
1. [How to build this app](#how-to-build-this-app)
1. [Features](#features)
1. [API guide](#api-guide)
1. [Future goals](#future-goals)

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

Next, we need to build the server. Once your database is up and running, simply run the following two commands in the project's server directory:

```
npm install
npm start
```
You can check that the server is running by visiting http://localhost:3001 in your browser. If you want to point at a specific MongoDB instance other than the default, or if you want your server to run on a different port, you can modify the [server configuration file](https://github.com/zacharytscott/todo/blob/master/server/config.json).
### Building and running the React app
Finally, we need to start up the React app. With the database and server running, execute the following two commands in the project's client directory:
```
yarn install
yarn start
```
This will start up react and open it in your browser. **If you are runnng your server at a different url than localhost:3001, you will need to modify the [client configuration file](https://github.com/zacharytscott/todo/blob/master/client/src/config.json) to specify the server you wish to point to**.

Congrats, you're all set! 🙌

---
## Features

This app allows you to track your daily tasks. Add and manage tasks with the task panels, clear all completed tasks, and filter tasks using the floating controls at the top of the app (your selection is saved in localStorage!).

### Error handling

The app's display doesn't break if it can't connect to the server!

<div align="middle">
<img src="https://github.com/zacharytscott/todo/blob/master/img/server-error.PNG" title="The Todo List app" width="35%"/>
</div>

And if there is an API error, we display a toast with [react-toastify](https://github.com/fkhadra/react-toastify):

<div align="middle">
<img src="https://github.com/zacharytscott/todo/blob/master/img/api-error.PNG" title="The Todo List app" width="35%"/>
</div>


### Responsive
<div align="middle">
<img src="https://github.com/zacharytscott/todo/blob/master/img/responsive-demo.gif" title="The Todo List app"/>
</div>

The app was tested against multiple device dimensions to ensure it looks good and works on all common devices.

### Accessible

The plugin was run against [AXE](https://www.deque.com/axe/) to ensure it contained no major accessibility concerns. The app uses semantic HTML where possible and aria attributes for custom elements. All use cases may be performed with the keyboard, with visual feeback given for focused elements.

---

## API guide

The Node.js server exposes a set of APIs that can be used to interact with the todo items you've created. If you use [Postman](https://www.getpostman.com/), you can also play around with the API using the [Postman collection](https://github.com/zacharytscott/todo/blob/master/todos.postman_collection.json) included in this repo.

All APIs expect and return JSON data.

### <span style="color:green">GET</span> all todo items
```
curl -X GET \
  http://localhost:3001/todos \
  -H 'Content-type: application/json' \
```
This call returns an array of todo items in the form of:
```
[
    ...

    {
        "_id": "This task ID (string)",
        "text": "The text content of the task (string)",
        "completed": "The status of this item (boolean)",
        "__v": 0 (number)
    },

    ...
]
```

### <span style="color:green">GET</span> a specific item
```
curl -X GET \
  http://localhost:3001/todos/{item id} \
  -H 'Content-type: application/json' \
```
This call returns a single todo item in the form of:
```
{
    "_id": "This task ID (string)",
    "text": "The text content of the task (string)",
    "completed": "The status of this item (boolean)",
    "__v": 0 (number)
}
```

### <span style="color:goldenrod">POST</span> a new item
```
curl -X POST \
  http://localhost:3001/todos \
  -H 'Content-type: application/json' \
  -d '{
	"text" : "The new task text",
	"completed" : true
    }'
```
This call accepts a single JSON object of the form:
```
{
    "text" : "The new task text",
	"completed" : true
}
```
It returns a new todo item of the form:
```
{
    "_id": "This task ID (string)",
    "text": "The new task text (string)",
    "completed": "The status of this item (boolean)",
    "__v": 0 (number)
}
```

### <span style="color:goldenrod">PUT</span> (modify) an item
```
curl -X PUT \
  http://localhost:3001/todos/{item id} \
  -H 'Content-type: application/json' \
  -d '{
	"text" : "This is the updated text",
	"completed" : "true"
    }'
```
This call accepts a single JSON object of the form:
```
{
    "text" : "The new task text",
	"completed" : true
}
```
It returns the updated todo item of the form:
```
{
    "_id": "This task ID (string)",
    "text": "The updated text (string)",
    "completed": "The status of this item (boolean)",
    "__v": 0 (number)
}
```

### <span style="color:indianred">DELETE</span> an item
```
curl -X DELETE \
  http://localhost:3001/todos/5cb3ec9520fbfe31e051cb7f \
```
This endpoint returns the contents of the deleted item
```
{
    "_id": "This task ID (string)",
    "text": "The task text (string)",
    "completed": "The status of this item (boolean)",
    "__v": 0 (number)
}
```

### <span style="color:indianred">DELETE</span> all items
```
curl -X DELETE \
  http://localhost:3001/todos \
```
This endpoint returns JSON in the form:
```
{
    "n": 3 (number),
    "ok": 1 (number),
    "deletedCount": the number of deleted items (number)
}
```

### <span style="color:indianred">DELETE</span> all completed items
```
curl -X DELETE \
  http://localhost:3001/todos?completed=true \
```
This endpoint returns JSON in the form:
```
{
    "n": 3 (number),
    "ok": 1 (number),
    "deletedCount": the number of deleted items (number)
}
```

### <span style="color:indianred">DELETE</span> all active items
```
curl -X DELETE \
  http://localhost:3001/todos?completed=false \
```
This endpoint returns JSON in the form:
```
{
    "n": 3 (number),
    "ok": 1 (number),
    "deletedCount": the number of deleted items (number)
}
```
---

## Future Goals

This is a simple app created for demo purposes. In the future, I'd like to:

* Add actual user authentication with a log-in screen using Passport (instead of using a single collection in the database)
* Optimize styling with a pre-processor
* Create a docker-compose file to make deployment easier
* Tweak transition group animations to make them smoother
* Make deployment easier with a docker-compose file

Hey! I could keep track of all these with this app! 🤯
