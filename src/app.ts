import dotenv_config from './Config/dotenv_config';
dotenv_config();
import db_connection from './Connections/db_connection';
db_connection;
import express from 'express';
import { Socket } from 'socket.io';
import loginRouter from './Routes/Login';
import registerRouter from './Routes/Register';
import logoutRouter from './Routes/Logout';
import mqttClient from './Connections/mqtt_client';

// TODO: Prendere i dati dal broker MQTT e mandarli ai vari client con Socket.IO

mqttClient.on('message', (topic, payload) => {

});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);

app.listen(process.env.SERVER_PORT, () => console.log(`[SERVER] Server online on port ${process.env.SERVER_PORT}.`));
