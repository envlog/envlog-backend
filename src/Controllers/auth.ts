import { Request, Response, NextFunction } from 'express';

export const doesNotRequireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.username)
        return next();

    return res.status(400).json({ error: "Already logged in!" });
}

export const requiresAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.username)
        return next();

    return res.status(401).json({ error: "You need to be logged in!" });
}

