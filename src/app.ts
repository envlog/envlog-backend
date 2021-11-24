import express from 'express';
import { Socket } from 'socket.io';
import loginRouter from './Routes/Login';
import registerRouter from './Routes/Register';
import logoutRouter from './Routes/Logout';
import db_connection from './Connections/db_connection';
import mqttClient from './Connections/mqtt_client';
import dotenv from 'dotenv';
dotenv.config();


db_connection;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);



app.listen(process.env.SERVER_PORT, () => console.log("Server Online"));
