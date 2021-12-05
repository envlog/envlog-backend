import dotenvConfig from './Config/dotenv_config';
dotenvConfig();
import dbConnection from './Connections/db_connection';
dbConnection();
import { loadSensorsCollection } from './Utils/sensors_loader';
loadSensorsCollection();
import { startMqttClient } from './Connections/start_mqtt_client';
startMqttClient();
import express from 'express';
import loginRouter from './Routes/Login';
import registerRouter from './Routes/Register';
import logoutRouter from './Routes/Logout';
import indexRouter from './Routes/Index';
import sensorsRouter from './Routes/Sensors';
import { staticFolder } from './Config/path';
import cors from 'cors';

const app = express();

app.use(cors({ credentials: true, origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', indexRouter); 
app.use('/auth/login', loginRouter);
app.use('/auth/register', registerRouter);
app.use('/auth/logout', logoutRouter);
app.use('/sensors', sensorsRouter);
app.use(express.static(staticFolder));

app.listen(process.env.SERVER_PORT, () => console.log(`[SERVER] Server online on port ${process.env.SERVER_PORT}.`));
