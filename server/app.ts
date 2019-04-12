import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import TodoModel from './models/todoModel';

//TODO: move these to config json file
const PORT = '3000';
const MONGO_PORT = '27017';
const app: express.Application = express();

app.use(bodyParser.json());

mongoose.connect(`mongodb://127.0.0.1:${MONGO_PORT}/todos`, { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

const routes = express.Router();

routes.route('/').get((request : express.Request, response : express.Response) => {
    TodoModel.find((error : any, todos : mongoose.Document) => {
        response.json(todos);
    });
});

routes.route('/:id').get((request : express.Request, response : express.Response) => {
    const id = request.params.id;

    TodoModel.findById(id, (error : any, todo : mongoose.Document) => {
        response.json(todo)
    });
});

routes.route('/').post((request : express.Request, response : express.Response) => {
    const todo = new TodoModel(request.body);

    todo.save()
        .then((todo : mongoose.Document) => {
            response.status(200).json({
                success : true,
            });
        })
        .catch((error : any)=> {
            response.status(400).json({
                error
            });
        })
});

routes.route('/:id').put((request : express.Request, response : express.Response) => {
    const id = request.params.id;

    TodoModel.findById(id, (error : any, todo : mongoose.Document) => {
        if(typeof todo === 'undefined') {
            response.status(404).send(`The specified todo item with ID ${id} was not found in the database.`);
        } else {
            Object.assign(todo, request.body);

            todo.save().then(todo => {
                response.json(todo);
            })
            .catch((error : any )=> {
                response.status(400).json({
                    error
                });
            });
        }
    });
});

routes.route('/:id').delete((request : express.Request, response : express.Response) => {
    const id = request.params.id;

    TodoModel.findById(id, (error : any, todo : mongoose.Document) => {
        if(typeof todo === 'undefined') {
            response.status(404).send(`The specified todo item with ID ${id} was not found in the database.`);
        } else {
            todo.remove().then(todo => {
                response.json(todo);
            })
            .catch(err => {
                response.status(400).send(`The request to delete the todo item with ID ${id} failed. Check that the database is running.`);
            });
        }
    });
});

app.use('/todos', routes);

app.listen(PORT, () => {
    console.log('The todo app has started successfully!');
});