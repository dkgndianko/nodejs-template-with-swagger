import {ApiController} from "../../core/controller";
import {Routing} from "../../docs/types";
import {UserDataDoc} from "./doc.type";
import {TokenManagement} from "../../core/tokenManagement";
import {NextFunction, Request, Response} from "express";

export default class AuthenticationController extends ApiController{
    constructor() {
        super('/api/auth', ['auth']);
    }
    getRoutes (): Array<Routing> {
        return [
            {
                path: "/token",
                method: "post", handler: this.getToken,
                description: "Create a token for a user",
                bodyParameter: UserDataDoc

            },
        ] as Array<Routing>;
    }

    getToken(request: Request, response: Response, next: NextFunction){
         const token = TokenManagement.getTokenWithJWT(request.body);
         if (!token) {
             response.status(401).json('Your AccessToken is Not Valid');
         }
         response.status(200).json(token);
    }


}
