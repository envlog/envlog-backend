import express, { Request, Response } from 'express';
import User from '../Models/user.model';
import session from '../Connections/session';
import { requiresAuth } from '../Middlewares/auth';
import { body, validationResult } from 'express-validator';
import { validIfExists } from '../Middlewares/validation';

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

meRouter.post(
	'/info',
	requiresAuth,
	body('username')
		.custom(validIfExists)
		.withMessage('Fornire un username valido!'),
	body('email').custom(validIfExists).withMessage("Fornire un'email valida!"),
	async (
		req: Request<
			{},
			{},
			{ username: string | undefined; email: string | undefined }
		>,
		res: Response
	) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res
				.status(400)
				.json({ errors: errors.array().map(item => item.msg) });
		try {
			const { username, email } = req.body;
			const user = await User.findOne({ Username: req.session.username });
			if (user) {
				const userId = user._id.toString();
				if (username && user.Username !== username) {
					const userWithUsername = await User.findOne({
						Username: username,
						_id: { $ne: userId },
					});
					if (userWithUsername)
						return res
							.status(409)
							.json({ errors: ['Esiste già un utente con questo username!'] });
					else {
						user.Username = username;
						req.session.username = username;
					}
				}
				if (email && user.Email !== email) {
					const userWithEmail = await User.findOne({
						Email: email,
						_id: { $ne: userId },
					});
					if (userWithEmail)
						return res
							.status(409)
							.json({ errors: ['Esiste già un utente con questa email!'] });
					else {
						user.Email = email;
						req.session.email = email;
					}
				}
				await user.save();
				return res.status(200).json({
					msg: 'Dati aggiornati.',
					user: { username: user.Username, email: user.Email },
				});
			}
			return res.status(404).json({ errors: ['Utente non trovato!'] });
		} catch (error) {
			return res.status(500).json({ errors: [error] });
		}
	}
);

export default meRouter;
