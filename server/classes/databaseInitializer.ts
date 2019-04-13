import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as express from 'express';

class databaseInitializer {
    initialize(app : express.Application, mongoPort : number) {
        app.use(bodyParser.json());

        mongoose.connect(`mongodb://127.0.0.1:${mongoPort}/todos`, { useNewUrlParser: true });

        const connection = mongoose.connection;

        connection.once('open', () => {
            console.log("MongoDB database connection established successfully!");
        });
    }
}

export default databaseInitializer;