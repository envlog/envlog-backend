import express, { Request, Response } from 'express';
import User from '../Models/user.model';
import session from '../Connections/session';
import { requiresAuth } from '../Middlewares/auth';

const meRouter = express.Router();

meRouter.use(session);

meRouter.get('/', requiresAuth, async (req: Request, res: Response) => {
	const username = req.session.username;
	const email = req.session.email;
	const user = await User.findOne(
		{
			$or: [{ Email: email }, { Username: username }],
		},
		{ __v: 0, _id: 0, Password: 0 }
	);
	return res.status(200).json(user);
});

export default meRouter;
