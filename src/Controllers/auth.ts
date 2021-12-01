import { Request, Response, NextFunction } from 'express';
import { CustomValidator } from 'express-validator';

export const requiresNoAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.username)
        return next();

    return res.status(400).redirect('/');
}

export const requiresAuth = (req: Request, res: Response, next: NextFunction) => {
    //if (req.session && req.session.username)
        return next();

    return res.status(401).redirect('/auth/login');
}

export const passwordsMatch: CustomValidator = (passwordConfirmation: string, { req }) => {    
    if (passwordConfirmation != req.body.password)
        throw "Le password non corrispondono!";

    return true;
}

export const userIsAdmin = (req: Request, res: Response, next: NextFunction) => {
    //if (req.session.isAdmin)
        return next();

    return res.status(401).json({ errors: ["Non hai i permessi necessari!"] });
}

