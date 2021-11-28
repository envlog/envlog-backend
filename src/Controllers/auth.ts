import { Request, Response, NextFunction } from 'express';

export const requiresNoAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.username)
        return next();

    return res.status(400).redirect('/');
}

export const requiresAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.username)
        return next();

    return res.status(401).redirect('/login');
}

