export type HttpMethod = "get" | "post" | "put" | "delete";

export interface SchemaDescription {
    name: string;
    description?: string;
    type: string;
    default?: any;
    format?: string;
    pattern?: string;
    example?: any;
    properties?: Array<SchemaDescription>;
    required?: boolean;
    items?: SchemaDescription | string | Array<any>; // in case of arrays
}
export interface Routing {
    path: string;
    method: HttpMethod;
    handler: any;
    httpStatus: string;
    summary: string;
    description: string;
    bodyParameter?: SchemaDescription; // for routes with body like POST, PUT and DELETE
    pathParameters?: Array<SchemaDescription>; // parameters in the path
    queryParameters?: Array<SchemaDescription>;
    responseParameter?: SchemaDescription;
    tags?: Array<string>; // tags
    protected?: boolean;
}