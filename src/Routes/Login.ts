import express, { Request, Response } from 'express';
import User from '../Models/user.model';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import session from '../Connections/session';
import { requiresNoAuth } from '../Controllers/auth';
import { staticFolder } from '../Config/path';

const loginRouter = express.Router();
loginRouter.use(session);

loginRouter.get(
    '/login', 
    requiresNoAuth, 
    (req, res) => {
        return res.status(200).sendFile('login.html', { root: staticFolder });
    }
);

loginRouter.post(
    '/login', 
    requiresNoAuth,
    body('email').isEmail().normalizeEmail().withMessage("L'email non è valida!"),
    body('password').isLength({ min: Number(process.env.MIN_PASS_LEN) }).trim().escape().withMessage('La password non è valida!'),
    async (req: Request<{}, {}, { email: string, password: string }>, res: Response) => {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ Email: email });
            if(!user) return res.status(400).json({ value: email, msg: "Email non trovata!", param: "email", location: "body" });
            let comparePsw = await bcrypt.compare(password, user.Password);
            if(!comparePsw) return res.status(400).json({ msg: "Password errata!", param: "password", location: "body" });
            req.session.username = user.Username;
            req.session.email = user.Email;
            req.session.isAdmin = user.IsAdmin;
            return res.status(200).json({ username: user.Username, email });
        } catch (error: any) {
            return res.status(500).json({ errors: error });
        } 
    }
);



export default loginRouter;