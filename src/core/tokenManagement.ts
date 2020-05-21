import {Secret, verify, sign, JsonWebTokenError, TokenExpiredError} from 'jsonwebtoken';
import {User} from '../middlewares/types'

export class TokenManagement{

    public static encodeJWTToken(payload: any, secret: Secret, expirationSecond: number | undefined) {
            return sign(
              payload,
              secret,
            {expiresIn: expirationSecond}
          )
    }

    public static decodeTokenJWT(token: string | null, secret: Secret): User | null {
         if (!token){
             return null;
         }
         let user: User | null;
         try {
             const decode: any = verify(token, secret);
             user = {
                 username: decode.username
             }
         }catch (error) {
             console.error(error);
             return null;
         }
        return user;
    }

    public static getTokenWithJWT (data: any) {
        let token: any;
        try {
            const payload: any = data;
            const expirationSeconds = process.env.JWT_EXPIRATION_SECONDS !== undefined ? parseInt(process.env.JWT_EXPIRATION_SECONDS) : 3600;
            token = this.encodeJWTToken(payload, process.env.JWT_SECRET_KEY || "AccessToken",  expirationSeconds);

        }catch (e) {
            console.error(e);
            return null;
        }
        return token;

    }
}
