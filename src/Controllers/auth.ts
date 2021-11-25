import { Request, Response, NextFunction } from 'express';

export const requiresNoAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.username)
        return next();

    return res.status(400).json({ error: "Already logged in!" }); // TODO: Redirect a dashboard
}

export const requiresAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.username)
        return next();

    return res.status(401).json({ error: "You need to be logged in!" }); // TODO: Redirect a login
}

