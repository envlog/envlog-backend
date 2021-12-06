import SensorData from '../Models/sensor_data.model';
import { Sensors, MQTTPayload, SensorSchema } from '../types';
import moment from 'moment';

let sensors: Sensors = {};

export const getLastInBuffer = (mcuId: string, type: string) => {
    const data = sensors[type]?.buffer.filter(item => item.MCU_ID === mcuId);

    if (data && data.length) return data[data.length - 1];

    return undefined;
}

export const saveToBuffer = async (mqttObject: MQTTPayload) => {
    const { DevAddr, ...minifiedObject } = mqttObject;
    const { Type, MCU_ID } = minifiedObject;

    let finalObject: SensorSchema = {
        Type,
        MCU_ID,
        Received: moment.utc().format()
    };

    if (!minifiedObject.Data) {
        const { Type, MCU_ID, ...dataProperties } = minifiedObject;
        const stringifiedProperties = JSON.stringify(dataProperties);
        finalObject.Data = stringifiedProperties;
    } else 
        finalObject.Data = JSON.stringify(minifiedObject.Data);

    if (!sensors[Type]) {
        sensors[Type] = {
            counter: 0,
            buffer: []
        }
    };

    sensors[Type].buffer.push(finalObject);
    sensors[Type].counter++;

    if (sensors[Type].counter === Number(process.env.ELEMENTS_PER_BUFFER)) {
        try {
            await SensorData.insertMany(sensors[Type].buffer);
            sensors[Type].counter = 0;
            sensors[Type].buffer.splice(0);
            console.log(`[DATABASE] Saved ${process.env.ELEMENTS_PER_BUFFER} ${Type} elements to database!`);
        } catch (err: any) {
            console.log(`[DATABASE] Error trying to save ${process.env.ELEMENTS_PER_BUFFER} ${Type} elements to database: ${err}.`);
        }
    };
}