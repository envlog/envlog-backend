import express, { Request, Response } from 'express';
import session from '../Connections/session';
import { requiresAuth } from '../Controllers/auth';
import { staticFolder } from '../Config/path';

const indexRouter = express.Router();
indexRouter.use(session);

indexRouter.get('', requiresAuth, (req: Request, res: Response) => {
    return res.sendFile('index.html', { root: staticFolder });
});


export default indexRouter;