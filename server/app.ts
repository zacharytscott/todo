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
    //TODO: can these be typed better?
    TodoModel.find((error : any, todos : any) => {
        response.json(todos);
    });
});

routes.route('/').post((request : express.Request, response : express.Response) => {
    const todo = new TodoModel(request.body);
    todo.save()
        .then((todo : any) => {
            response.status(200).json({
                success : true,
            });
        })
        .catch((error : any)=> {
            response.status(400).json({
                success : false,
            });
        })
});

app.use('/todos', routes);

app.listen(PORT, () => {
    console.log('The todo app has started successfully!');
});