import mqttClient from './mqtt_client';
import io from './socket';
import { MQTTPayload, SensorInterface } from '../types';
import { saveToBuffer } from '../Utils/save_to_buffer';
import { SocketObject } from '../types';
import { sensorsCollection } from '../Utils/sensors_loader';

const socketBroadcastExclusions = [
	'TimeDomainDataInfo',
	'RMSSpeedStatus',
	'FreqData',
	'AccPeakStatus',
];

export const startMqttClient = async () => {
	/*
        Legge i dati in arrivo dal broker MQTT, li invia a tutti i socket connessi e li raccoglie in un buffer                  
        Una volta raccolti N dati, essi vengono salvati nel database e il buffer viene pulito 
    */
	mqttClient.on('message', async (_: string, payload: Buffer) => {
		const mqttObject: MQTTPayload = JSON.parse(payload.toString());
		mqttObject.MCU_ID = mqttObject.MCU_ID
			? mqttObject.MCU_ID
			: mqttObject.DevAddr;

		if (!mqttObject.Type) return;

		if (socketBroadcastExclusions.includes(mqttObject.Type)) {
			await saveToBuffer(mqttObject);
			return;
		}

		if (sensorsCollection) {
			let sensor: SensorInterface | undefined;

			if (mqttObject.Type === 'Battery')
				// Se è un dato di tipo batteria, controllo che almeno un sensore con quell'ID sia attivo
				sensor = sensorsCollection.find(
					({ MCU_ID, Enabled }) => MCU_ID === mqttObject.MCU_ID && Enabled
				);
			else
				sensor = sensorsCollection.find(
					({ MCU_ID, Type }) =>
						MCU_ID === mqttObject.MCU_ID && Type === mqttObject.Type
				);

			if (!sensor || (sensor && !sensor.Enabled)) return; // Controllo che il sensore sia attivo o che sia presente nella lista
		}

		await saveToBuffer(mqttObject);

		const socketObject: SocketObject = {
			MCU_ID: mqttObject.MCU_ID,
			Type: mqttObject.Type,
			Unit: mqttObject.Unit,
		};

		if (mqttObject.Type === 'Battery')
			socketObject.Voltage = mqttObject.Voltage as unknown as number; // Che schifo

		if (mqttObject.Level) socketObject.Value = mqttObject.Level;
		else if (mqttObject.Value) socketObject.Value = mqttObject.Value;
		else if (mqttObject.Data) socketObject.Value = mqttObject.Data;
		else return;

		io.emit('data', JSON.stringify(socketObject));
	});
};
