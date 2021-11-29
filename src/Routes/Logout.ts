import express, { Request, Response } from 'express';
import session from '../Connections/session';
import { requiresAuth } from '../Controllers/auth';

const logoutRouter = express.Router();

logoutRouter.use(session);

logoutRouter.post('/', requiresAuth, (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Couldn't destroy session!" });
        }
    });

    return res.status(200).redirect('/login');
});



export default logoutRouter;