import dotenv_config from './Config/dotenv_config';
dotenv_config();
import db_connection from './Connections/db_connection';
db_connection;
import express from 'express';
import loginRouter from './Routes/Login';
import registerRouter from './Routes/Register';
import logoutRouter from './Routes/Logout';
import indexRouter from './Routes/Index';
import mqttClient from './Connections/mqtt_client';
import { staticFolder } from './Config/path';
import io from './Connections/socket';
import SensorData from './Models/sensor.model';
import { Sensors, MQTTPayload } from './types';


var sensors: Sensors = {};


mqttClient.on('message', async (topic, payload: Buffer) => { // Legge i dati in arrivo da MQTT e li invia a tutti i socket connessi
    console.log(`[MQTT] Incoming ${topic}.`);

    const object: MQTTPayload = JSON.parse(payload.toString()); 
    var { DevAddr, ...minifiedObject } = object;
    const Type = minifiedObject.Type;

    if (!minifiedObject.Data) {
        const { Type, MCU_ID, ...dataProperties } = minifiedObject;
        const stringifiedProperties = JSON.stringify(dataProperties);
        const tempObject = {
            Type,
            MCU_ID,
            Data: stringifiedProperties
        }
        minifiedObject = tempObject;
    } else 
        minifiedObject.Data = JSON.stringify(minifiedObject.Data);

    if (!sensors[Type]) {
        sensors[Type] = {
            counter: 0,
            buffer: []
        }
    };

    sensors[Type].buffer.push(minifiedObject);
    sensors[Type].counter++;

    if (sensors[Type].counter === Number(process.env.ELEMENTS_PER_BUFFER)) {
        try {
            await SensorData.insertMany(sensors[Type].buffer);
            sensors[Type].counter = 0;
            sensors[Type].buffer.splice(0);
        } catch (err: any) {
            console.log(err)
        }
    };
    
    // io.emit('data', payload.toString());
}); 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', indexRouter); 
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use(express.static(staticFolder));

app.listen(process.env.SERVER_PORT, () => console.log(`[SERVER] Server online on port ${process.env.SERVER_PORT}.`));
