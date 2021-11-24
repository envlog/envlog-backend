import express, { Request, Response } from 'express';
import User from '../Models/user.model';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import session from '../Connections/session';
import { doesNotRequireAuth } from '../Controllers/auth';

dotenv.config();


const registerRouter = express.Router();
registerRouter.use(session);

registerRouter.get('/', (req, res) => {
    return res.status(200).json({ message: "Ok" });
    /* Servire il register.html statico */
})

registerRouter.post(
    '/',
    doesNotRequireAuth,
    body('username').isLength({ min: Number(process.env.MIN_USERNAME_LEN) }).withMessage('Username must be at least 5 characters!').trim().escape(),
    body('email').isEmail().normalizeEmail().withMessage('Email is not valid!'),
    body('password').isLength({ min: Number(process.env.MIN_PASS_LEN) }).withMessage('Password must be at least 6 characters!').trim().escape(),
    
    async (req: Request<{}, {}, { username: string, email: string, password: string }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        
        const { username, email, password } = req.body;
        
        try {
            const hashPsw: string = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
            const user = new User({ username, email, password: hashPsw });
            await user.save();
            return res.status(200).json({ message: "Saved user to database!" });
        } catch (err: any) {
            return res.status(500).json({ error: "Error saving to database!" });
        }
    }
)

export default registerRouter;