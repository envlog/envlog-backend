import mqttClient from './mqtt_client';
import io from './socket';
import { MQTTPayload } from '../types';
import { saveToBuffer } from '../Utils/save_to_buffer';
import { SocketObject } from '../types';
import { sensorsCollection } from '../Utils/sensors_loader';

const socketBroadcastExclusions = ['Battery', 'TimeDomainDataInfo', 'RMSSpeedStatus', 'FreqData', 'AccPeakStatus'];

export const startMqttClient = async () => {
    /*
        Legge i dati in arrivo dal broker MQTT, li invia a tutti i socket connessi e li raccoglie in un buffer                  
        Una volta raccolti N dati, essi vengono salvati nel database e il buffer viene pulito 
    */
    mqttClient.on('message', async (_: string, payload: Buffer) => { 
        const mqttObject: MQTTPayload = JSON.parse(payload.toString());
	
	    if (!mqttObject.MCU_ID || !mqttObject.Type) return;

        if (socketBroadcastExclusions.includes(mqttObject.Type)) {
            await saveToBuffer(mqttObject);
            return;
        }

        if (sensorsCollection) {
            const sensor = sensorsCollection.find(({ MCU_ID, Type }) => MCU_ID === mqttObject.MCU_ID && Type === mqttObject.Type); 
            if (!sensor || (sensor && !sensor.Enabled)) return; // Controllo che il sensore sia attivo o che sia presente nella lista
        }

        await saveToBuffer(mqttObject);

        const socketObject: SocketObject = {
            MCU_ID: mqttObject.MCU_ID,
            Type: mqttObject.Type,
            Unit: mqttObject.Unit
        }

        if (mqttObject.Level) socketObject.Value = mqttObject.Level;
        else if (mqttObject.Value) socketObject.Value = mqttObject.Value;
        else if (mqttObject.Data) socketObject.Value = mqttObject.Data;
        else return;
        
        
        io.emit('data', JSON.stringify(socketObject));
    }); 
}

