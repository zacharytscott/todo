import * as express from 'express';
import * as mongoose from 'mongoose';
import * as fs from 'fs';
import TodoModel from './databaseModels/todoModel';
import ConfigurationJSONInterface from './interfaces/ConfigurationJSONInterface';
import DeleteFilter from './interfaces/DeleteFilter';
import DatabaseInitializer from './classes/databaseInitializer'

const configurationJSONPath = './config.json';
const configuration : string = fs.readFileSync(configurationJSONPath, 'utf8');
const configurationJSON : ConfigurationJSONInterface = JSON.parse(configuration);
const PORT = configurationJSON.port;
const MONGO_PORT = parseInt(configurationJSON.mongoPort);
const app: express.Application = express();

const dbInitializer = new DatabaseInitializer();
dbInitializer.initialize(app, MONGO_PORT);

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

    todo.save().then((todo : mongoose.Document) => {
        response.status(200).json({todo});
    })
    .catch((error : any) => {
        response.status(400).json({error});
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
                response.status(400).json({error});
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
            todo.remove().then(result => {
                response.json(result);
            })
            .catch(error => {
                response.status(400).json({error});
            });
        }
    });
});

routes.route('/').delete((request : express.Request, response : express.Response) => {
    const filter : DeleteFilter = {};

    if(request.query && request.query.hasOwnProperty('completed')) {
        filter.completed = request.query.completed;
    }

    TodoModel.deleteMany(filter).then(result  => {
        response.json(result);
    })
    .catch(error => {
        response.status(400).json({error});
    })
});

app.use('/todos', routes);

app.listen(PORT, () => {
    console.log('The todo app has started successfully!');
});