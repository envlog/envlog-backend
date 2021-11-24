import mongoose from 'mongoose';

const db_init = () => {
    mongoose.connect('mongodb://localhost:27017/users');
    const db = mongoose.connection;
    db.on('error', (err: any) => console.log(err.message));
    db.once('open', () => console.log("Connected to Database"));
}

export default db_init();