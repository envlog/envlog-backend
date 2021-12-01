import express, { Request, Response } from 'express';
import session from '../Connections/session';
import { requiresAuth } from '../Controllers/auth';

const logoutRouter = express.Router();

logoutRouter.use(session);

logoutRouter.post('/logout', requiresAuth, (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ errors: ["Impossibile distruggere la sessione!"] });
    });

    return res.status(200).redirect('/auth/login');
});

export default logoutRouter;