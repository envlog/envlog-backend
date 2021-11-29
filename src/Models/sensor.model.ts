import mongoose from 'mongoose';

const SensorDataSchema = new mongoose.Schema(
    {
        MCU_ID: {
            type: String,
            required: true
        },
        Data: { // Conterrà un oggetto o un array stringified con le proprietà che ci interessano
            type: String,
            required: true
        },
        Type: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            required: true,
        } 
    }
);

const MAX_TIME = 60 * 60 * 24 * 14; // 2 settimane

SensorDataSchema.index({ createdAt: 1 }, { expireAfterSeconds: MAX_TIME } )

const SensorData = mongoose.model('SensorsDataHistory', SensorDataSchema);

export default SensorData;