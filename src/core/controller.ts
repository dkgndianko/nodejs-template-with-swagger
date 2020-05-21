import { Router } from "express";
import {Routing} from "../docs/types";

export abstract class Controller {
    private readonly path: string;
    private readonly router: Router;


    protected constructor(path: string) {
        this.path = path;
        this.router = Router();
        this.initializeRoutes();
    }

    public abstract getRoutes(): Array<Routing>;


    public getPath(): string {
        return this.path;
    }


    public getRouter(): Router {
        return this.router;
    }
    

    private initializeRoutes(): void {
        this.getRoutes().forEach((route) => {
            Reflect.get(this.router, route.method).call(this.router, route.path, route.handler.bind(this));
        });
    }
    
}

export abstract class ApiController extends Controller {
    private readonly tags: Array<string>;
    private readonly authenticated: boolean;
    protected constructor(path: string, tags: Array<string> | null, authenticated = true) {
        super(path);
        this.tags = tags || [];
        this.authenticated = authenticated;
    }

    public getTags(): Array<string> {
        return this.tags;
    }

    public isProtected(): boolean {
        return this.authenticated;
    }
}