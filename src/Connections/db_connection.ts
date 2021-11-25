import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const db_init = () => {
    mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    const db = mongoose.connection;
    db.on('error', (err: any) => console.log(err.message));
    db.once('open', () => console.log("Connected to Database"));
}

export default db_init();