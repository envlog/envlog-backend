import express, { Request, Response } from 'express';
import User from '../Models/user.model';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import session from '../Connections/session';
import { comparePassword, requiresNoAuth } from '../Controllers/auth';
import { staticFolder } from '../Config/path';

const registerRouter = express.Router();
registerRouter.use(session);

registerRouter.get(
    '/register', 
    requiresNoAuth, 
    (req, res) => {
        return res.status(200).sendFile('register.html', { root: staticFolder });
    }
)

registerRouter.post(
    '/register',
    requiresNoAuth,
    comparePassword,
    body('username').isLength({ min: Number(process.env.MIN_USERNAME_LEN) }).trim().escape().withMessage(`Il nome utente deve contenere almeno ${process.env.MIN_USERNAME_LEN} caratteri!`),
    body('email').isEmail().normalizeEmail().withMessage("L'email non è valida!"),
    body('password').isLength({ min: Number(process.env.MIN_PASS_LEN) }).trim().escape().withMessage(`La password deve contenere almeno ${process.env.MIN_PASS_LEN} caratteri!`),
    
    async (req: Request<{}, {}, { username: string, email: string, password: string }>, res: Response) => {

        const errors = validationResult(req);
        const errorsArray = errors.array();
        res.locals.error && errorsArray.push(res.locals.error);
        if (errorsArray.length) return res.status(400).json({ errors: errorsArray });
        
        const { username, email, password } = req.body;
        
        try {
            const user = await User.findOne({ $or: [{ Email: email }, { Username: username }] }); // Controlliamo se esiste già la mail e/o l'username con $or
            if (user) return res.status(400).json({ errors: { msg: "Email o nome utente già esistenti!" } }); //Controllo lato front-end se errors è un array
            const hashPsw: string = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
            const newUser = new User({ Username: username, Email: email, Password: hashPsw });
            await newUser.save();
            return res.status(201).json({ username, email });
        } catch (error: any) {
            return res.status(500).json({ errors: { msg: error } });
        }
    }
)

export default registerRouter;