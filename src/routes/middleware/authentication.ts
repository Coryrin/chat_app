import { Response, Request, NextFunction } from "express";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

const isTokenValid = (authToken: string): boolean => {
    dotenv.config();

    const secret = process.env.JSON_WEB_TOKEN_SECRET;

    if (!secret) {
        return false;
    }

    try {
        jwt.verify(authToken, secret);

        return true;
    } catch (error) {
        console.error(`Error validating token: ${authToken}`);
        return false;
    }
};

export function checkAuthenticationToken(req: Request, res: Response, next: NextFunction): void {
    if (!req.headers.authorization) {
        res.send({
            error: 'No authorization token provided',
        }).status(400);
        return;
    }

    if (!isTokenValid(req.headers.authorization)) {
        res.send({
            error: 'Authentication token not recongised',
        }).status(400);
        return;
    }

    next();
}
