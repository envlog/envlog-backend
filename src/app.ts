import dotenv_config from './Config/dotenv_config';
dotenv_config();
import db_connection from './Connections/db_connection';
db_connection;
import { loadSensorsCollection } from './Utils/sensors_loader';
loadSensorsCollection();
import { startMqttClient } from './Connections/startMqttClient';
startMqttClient();
import express from 'express';
import loginRouter from './Routes/Login';
import registerRouter from './Routes/Register';
import logoutRouter from './Routes/Logout';
import indexRouter from './Routes/Index';
import sensorsRouter from './Routes/Sensors';
import { staticFolder } from './Config/path';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', indexRouter); 
app.use('/auth', loginRouter);
app.use('/auth', registerRouter);
app.use('/auth', logoutRouter);
app.use('/sensors', sensorsRouter);
app.use(express.static(staticFolder));

app.listen(process.env.SERVER_PORT, () => console.log(`[SERVER] Server online on port ${process.env.SERVER_PORT}.`));
