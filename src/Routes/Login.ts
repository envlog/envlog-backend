import express, { Request, Response } from 'express';
import User from '../Models/user.model';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import session from '../Connections/session';
import { doesNotRequireAuth } from '../Controllers/auth';
dotenv.config();

const loginRouter = express.Router();
loginRouter.use(session);

loginRouter.get('/', (req, res) => {
    /* Servire il login.html statico */
});

loginRouter.post(
    '/', 
    doesNotRequireAuth,
    body('email').isEmail().normalizeEmail().withMessage('Email is not valid!'),
    body('password').isLength({ min: Number(process.env.MIN_PASS_LEN) }).trim().escape().withMessage('Password is not valid!'),
    async (req: Request<{}, {}, { email: string, password: string }>, res: Response) => {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        
        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email: email });
            if (!user) return res.status(404).json({ message: "Email not found!" });
            let comparePsw = await bcrypt.compare(password, user.password);
            if (!comparePsw) return res.status(400).json({ message: "Incorrect password!" });
            req.session.username = user.username;
            req.session.email = user.email;
            req.session.isAdmin = user.isAdmin;
            //TODO: redirect dashboard 
            return res.status(200).json({ message: "Logged in", user: user });

        } catch (err: any) {
            return res.status(500).json({ error: err });
        } 
    }
);



export default loginRouter;