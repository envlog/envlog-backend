import mongoose from 'mongoose';

const dbInit = () => {
	mongoose.connect(
		process.env.ATLAS_URL || `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
		error => {
			if (error) console.log(error);
		}
	);
	const db = mongoose.connection;
	db.once('open', () =>
		console.log(
			`[DATABASE] Connected to ${process.env.ATLAS_URL || `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`}.`
		)
	);
};

export default dbInit;
