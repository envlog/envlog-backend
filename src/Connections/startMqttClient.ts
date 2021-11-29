import mqttClient from './mqtt_client';
import io from './socket';
import SensorData from '../Models/sensor.model';
import { Sensors, MQTTPayload, SensorSchema } from '../types';
import moment from 'moment';

let sensors: Sensors = {};

export const startMqttClient = () => {
    mqttClient.on('message', async (topic, payload: Buffer) => { // Legge i dati in arrivo dal broker MQTT, li invia a tutti i socket connessi e li raccoglie in un buffer
        //console.log(`[MQTT] Incoming ${topic}.`);              // Una volta raccolti N dati, essi vengolo salvati nel database e il buffer viene pulito
    
        const mqttObject: MQTTPayload = JSON.parse(payload.toString()); 
        
        const { DevAddr, ...minifiedObject } = mqttObject;
        const { Type, MCU_ID } = minifiedObject;

        let finalObject: SensorSchema = {
            Type,
            MCU_ID,
            createdAt: moment.utc().format()
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
        
        io.emit('data', payload.toString());
    }); 
}

