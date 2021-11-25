import dotenv from 'dotenv';
import expS from 'express-session';
dotenv.config();

declare module 'express-session' {
    export interface SessionData {
      username: string,
      email: string,
      isAdmin: boolean
    }
}

const session = expS({
    secret: process.env.SESSION_SECRET!,
    saveUninitialized: true,
    resave: false
})

export default session;