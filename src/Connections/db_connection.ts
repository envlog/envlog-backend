import mongoose from 'mongoose';

const db_init = () => {
    mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, (error) => {
        if (error)
            console.log(error);
    });
    const db = mongoose.connection;
    db.once('open', () => console.log(`[DATABASE] Connected to mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}.`));
}

export default db_init;