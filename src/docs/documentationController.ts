import {Controller} from "../core/controller";
import {Request, Response, NextFunction, RequestHandler} from "express";
import DocumentationService from "./service";
import {Routing, SchemaDescription} from "./types";
import swaggerUi from "swagger-ui-express";


export default class DocumentationController extends Controller {
    private swaggerSetup: RequestHandler | null;
    constructor() {
        super("/api-docs");
        this.getRouter().use("/", swaggerUi.serve);
        this.swaggerSetup = null;
    }

    public getRoutes() {
        return [
            {path: "/", method: "get", handler: this.docs},
            {path: "/openapi.json", method: "get", handler: this.getOpenApi},
        ] as Array<Routing>;
    }


    async docs(request: Request, response: Response, next: NextFunction) {
        if (this.swaggerSetup == null) {
            console.log("docs was called for the first time!");
            this.swaggerSetup = swaggerUi.setup((DocumentationService.getApiDefinition()));
        }
        this.swaggerSetup(request, response, next);
    }


    async getOpenApi(request: Request, response: Response, next: NextFunction) {
        response.status(200).json(DocumentationService.getApiDefinition());
        return true;
    }

}