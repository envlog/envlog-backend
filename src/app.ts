import express from 'express';
import mongoose from 'mongoose';
import { Socket } from 'socket.io';
import loginRouter from './Routes/Login';
import registerRouter from './Routes/Register';
import db_connection from './connections/db_connection';
import mqttClient from './connections/mqtt_client';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/login', loginRouter);
app.use('/register', registerRouter);


//db_connection;


app.listen(3001, () => console.log("Server Online"));
