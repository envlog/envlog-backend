import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	Username: {
		type: String,
		unique: true,
		required: true,
	},
	Email: {
		type: String,
		unique: true,
		required: true,
	},
	Password: {
		type: String,
		required: true,
	},
	IsAdmin: {
		type: Boolean,
		default: false,
	},
});

const User = mongoose.model('User', UserSchema);

export default User;
