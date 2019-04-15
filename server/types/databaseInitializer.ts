import mongoose from 'mongoose';

class DatabaseInitializer {
    initialize(mongoUrl : string) {
        mongoose.connect(mongoUrl, { useNewUrlParser: true });

        const connection = mongoose.connection;

        console.log(`Attempting to connect to the database at ${mongoUrl}...`);

        connection.once('open', () => {
            console.log("MongoDB database connection established successfully!");
        });
    }
}

export default DatabaseInitializer;