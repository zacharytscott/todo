import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as express from 'express';

class DatabaseInitializer {
    initialize(app : express.Application, mongoUrl : string) {
        app.use(bodyParser.json());

        mongoose.connect(mongoUrl, { useNewUrlParser: true });

        const connection = mongoose.connection;

        connection.once('open', () => {
            console.log("MongoDB database connection established successfully!");
        });
    }
}

export default DatabaseInitializer;