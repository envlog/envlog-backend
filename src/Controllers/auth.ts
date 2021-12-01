import { Request, Response, NextFunction } from 'express';

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

export const comparePassword = ({ body: { password, passwordConfirmation } }: Request, res: Response, next: NextFunction) => {
    if (password != passwordConfirmation)
        res.locals.error = {
            msg: "Le password non corrispondono!",
            param: "passwordConfirmation",
            location: "body"
        }

    return next();
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    //if (req.session.isAdmin)
        return next();

    return res.status(401).json({ errors: ["Non hai i permessi necessari!"] });
}

