import mongoose from 'mongoose';

const SensorsSchema = new mongoose.Schema(
    {
        MCU_ID: {
            type: String,
            required: true
        },
        Name: {
            type: String,
            unique: true
        },
        Type: {
            type: String,
            required: true
        },
        Enabled: {
            type: Boolean,
            default: true
        }
    }
)

const Sensor = mongoose.model('Sensor', SensorsSchema);

export default Sensor;
