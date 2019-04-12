import * as express from 'express';

//TODO: move this to config json file
const PORT = '3000';
const app = express();

app.get('/', (request : express.Request, response : express.Response) => {
    response.send(`<h1>Hello!</h1><p>We're just gettin' started. :)</p>`);
});