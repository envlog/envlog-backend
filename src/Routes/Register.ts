import express, { Request, Response } from 'express';
import User from '../Models/user.model';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import session from '../Connections/session';
import { requiresNoAuth } from '../Controllers/auth';

const registerRouter = express.Router();
registerRouter.use(session);

registerRouter.get(
    '/', 
    requiresNoAuth, 
    (req, res) => {
        return res.status(200).json({ message: "Ok" });
        /* TODO: Servire il register.html statico */
    }
)

registerRouter.post(
    '/',
    requiresNoAuth,
    body('username').isLength({ min: Number(process.env.MIN_USERNAME_LEN) }).trim().escape().withMessage('Username must be at least 5 characters!'),
    body('email').isEmail().normalizeEmail().withMessage('Email is not valid!'),
    body('password').isLength({ min: Number(process.env.MIN_PASS_LEN) }).trim().escape().withMessage('Password must be at least 6 characters!'),
    
    async (req: Request<{}, {}, { username: string, email: string, password: string }>, res: Response) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        
        const { username, email, password } = req.body;
        
        try {
            const user = await User.findOne({ $or: [{ email }, { username }] }); // Controlliamo se esiste già la mail e/o l'username con $or
            if (user) return res.status(400).json({ error: "User already exists!" });
            const hashPsw: string = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
            const newUser = new User({ username, email, password: hashPsw });
            await newUser.save();
            return res.status(200).json({ message: "Saved user to database!" });
            // TODO: Redirect a login
        } catch (error: any) {
            return res.status(500).json({ error: "Error saving to database!" });
        }
    }
)

export default registerRouter;