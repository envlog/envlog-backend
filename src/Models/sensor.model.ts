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
        }
    }
);

const SensorData = mongoose.model('SensorsDataHistory', SensorDataSchema);


export default SensorData;