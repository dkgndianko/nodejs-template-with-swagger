import express from 'express';
import * as http from "http";
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import {ApiController, Controller} from './core/controller';
import cors from "./middlewares/cors.middleware";
import loggerMiddleware from "./middlewares/logger.middleware";
import Database from "./data/database";
import DocumentationService from "./docs/service";
import {authenticationWithJWT} from './middlewares/auth.middleware';
import {unlessMatching} from "./middlewares/unless.middleware";


/**
 * This class is the mont point of the application.
 * It will hold everything about the app: routes, controllers, config, listeners, middleware
 */
export default class App {
    protected app: express.Application;
    protected serverPort: number;
    protected serverInstance: http.Server | null;
    protected listeners: CallableFunction[];
    private initialized = false;
    private controllers: Array<Controller>;


    constructor(controllers: Controller[], port: number, listeners: any[] = []) {
        this.app = express();
        this.serverPort = port;
        this.listeners = listeners;
        this.serverInstance = null;
        this.controllers = controllers;
        this.onAppStarted(function () {
            DocumentationService.controllers = controllers.filter((controller) => controller instanceof ApiController) as Array<ApiController>;
        });
    }

    /**
     * Add a listener to be called when app is started
     * @param listener: {any}
     */
    public onAppStarted(listener: any): void {
        this.listeners.push(listener);
    }

    /**
     * Binds a router to a path
     * @param path: {string}
     * @param router: {express.Router}
     */
    public bind(path: string, router: express.Router): void {
        this.app.use(path, router);
    }

    /**
     * Private method for initializing controllers
     */
    private initializeControllers(): void {
        this.controllers.forEach( (controller) => {
            this.bind(controller.getPath(), controller.getRouter());
        });
    }

    /**
     * This private method will initialize middlewares in the app.
     * When there is a new middleware exists, it must be added there
     */
    private initializeMiddlewares () {
        // yarn add cookie-parser
        // yarn add -D @types/cookie-parser
        // import * as cookieParser from 'cookie-parser';
        // this.app.use(cookieParser());

        this.app.use(cors);  // register CORS before auth
        // const checkAuthentication = process.env.NODE_ENV == "production";
        const checkAuthentication = true;
        // Authentication for API endpoints (exclude non API urls like documentation, and authentication)
        //this.app.use("/api/", authenticationMiddlewareWithBase64(false));
        this.app.use("/api/", unlessMatching(authenticationWithJWT(checkAuthentication), {path: new RegExp("/api/auth/.*")}));
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json());
        if (process.env.DEBUG === 'true') {
            this.app.use(loggerMiddleware);
        }
        this.app.use(morgan(process.env.NODE_ENV || 'dev'));
        // import expressIp from 'express-ip';
        // app.use(expressIp().getIpInfoMiddleware);
    }

    /**
     * App components initialization
     */
    public async initAppComponents(): Promise<void> {
        console.log("Initializing app components.....");
        return new Promise<void>((resolve, reject) => {
            this.initializeMiddlewares();
            this.initializeControllers();
            Database.connectToDatabase().then(() => {
                console.log("Database started");
                this.initialized = true;
                console.log("App components initialized successfully!");
                resolve();
            }).catch(
                (error) => {
                    reject(error);
                }
            );
        });
    }

    /**
     * start app components
     */
    private startAppComponents(): void {
        // Components starting goes there
    }


    /**
     * stop app components
     */
    private stopAppComponents(): void {
        // TODO call database close there
    }

    /**
     * Start the server
     */
    public async start() {
        console.log("starting application...");
        if (!this.initialized) {
           console.log("The application is not correctly initialized!");
        }
        this.serverInstance =  this.app.listen(this.serverPort, () => {
            console.log(`application started at port ${this.serverPort}. Adding listeners....`);
            this.listeners.forEach( (listener) => {
                listener();
            });
        });
        this.startAppComponents();
    }


    /**
     * Stop the app
     */
    public stop(): void {
        console.log("Stopping application....");
        this.stopAppComponents();
        if (this.serverInstance) {
            this.serverInstance.close();
        }
    }
}
