import { Request, Response, NextFunction } from 'express';

export const requiresNoAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.username)
        return next();

    return res.status(400).redirect('/');
}

export const requiresAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.username)
        return next();

    return res.status(401).redirect('/auth/login');
}

export const comparePassword = ({ body: { password, passwordConfirmation } }: Request, res: Response, next: NextFunction) => {
    if (password === passwordConfirmation)
        return next();
        
    return res.status(401).json({ message: "Passwords do not match!" });
}

