import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export default () => {
    const connect = () => {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in the environment variables');
        }
        mongoose.connect(process.env.MONGO_URI)
            .then(() => console.log("Successfully connected to database"))
            .catch((err) => {
                console.error("Error connecting to MongoDB", err);
                process.exit(1); // Stop the process if the database connection fails
            });
    };

    connect();
    
    mongoose.connection.on('disconnected', connect);
};
