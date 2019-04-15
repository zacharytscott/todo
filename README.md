# Todo List
This is a simple todo app built on the MERN stack.

## Table of Contents
1.[How to build this app](#how-to-build-this-app)

## How to build this app
### Building the database
```
docker build -t todo_mongo .
docker run -p 27017:27017 todo_mongo
```