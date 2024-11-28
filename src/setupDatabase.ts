import mongoose from "mongoose";
import dotenv from 'dotenv';
import { config } from "./config";
dotenv.config();

export default () => {
    const connect = () => {
        // if (!process.env.MONGO_URI) {
        if (!`${config.DATABASE_URL}`) {
            throw new Error('MONGO_URI is not defined in the environment variables');
        }
        // mongoose.connect(process.env.MONGO_URI)
        mongoose.connect(`${config.DATABASE_URL}`)
            .then(() => console.log("Successfully connected to database"))
            .catch((err) => {
                console.error("Error connecting to MongoDB", err);
                process.exit(1); // Stop the process if the database connection fails
            });
    };

    connect();

    mongoose.connection.on('disconnected', connect);
};
