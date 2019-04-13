import mongoose from 'mongoose';

class DatabaseInitializer {
    initialize(mongoUrl : string) {
        mongoose.connect(mongoUrl, { useNewUrlParser: true });

        const connection = mongoose.connection;

        connection.once('open', () => {
            console.log("MongoDB database connection established successfully!");
        });
    }
}

export default DatabaseInitializer;