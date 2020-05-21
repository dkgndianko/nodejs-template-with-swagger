import {TokenManagement} from '../core/tokenManagement';
import {Response, NextFunction} from 'express';

const TOKEN_TYPE = "Bearer";

const getToken = (authorization: string | undefined): string | null => {
    if (!authorization) {
        return '';
    }
    const parts: string[] = (authorization || '').split(' ');
    if (parts[0] != TOKEN_TYPE) {
        return null;
    }
    return parts.length > 1 ? parts[1] : '';
};

export const authenticationWithJWT = (checkAuthentication: boolean) => {
    return (request: any, response: Response, next: NextFunction) => {
        const user: any | null = TokenManagement.decodeTokenJWT(getToken(request.headers.authorization), process.env.JWT_SECRET_KEY || "AccessToken");
        if (user) {
            request.user = user;
        }
        if (checkAuthentication) {
            if (!user) {
                response.status(401).send('Invalid token or token not provided');
            } else {
                if (!user.expirationDate || new Date(user.expirationDate) > new Date()) {
                    response.status(401).send('Your Token is expired');
                } else {
                    next();
                }
            }
        } else {
            next();
        }
    }
};
