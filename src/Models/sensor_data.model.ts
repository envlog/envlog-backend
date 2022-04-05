import mongoose from 'mongoose';

const SensorDataSchema = new mongoose.Schema({
	MCU_ID: {
		type: String,
		required: true,
	},
	Data: {
		// Conterrà un oggetto o un array stringified con le proprietà che ci interessano
		type: String,
		required: true,
	},
	Type: {
		type: String,
		required: true,
	},
	Received: {
		type: Date,
		required: true,
	},
});

SensorDataSchema.index(
	{ Received: 1 },
	{ expireAfterSeconds: Number(process.env.EXPIRE_AFTER_SECONDS) }
);

const SensorData = mongoose.model('SensorsDataHistory', SensorDataSchema);

export default SensorData;
