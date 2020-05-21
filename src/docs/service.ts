import {Routing, SchemaDescription} from "./types";
import {ApiController} from "../core/controller";
import {openApiDefinition} from "./openapi";

interface DefinitionParsing {
    definition: any;
    dependencies: Array<SchemaDescription>;
}

interface SchemaGenerationResult {
    definitions: any;
    generatedSchemaNames: Array<string>;
}

interface ParameterResult extends SchemaGenerationResult {
    parameterDefinition: any;
}

interface PathResultResult extends SchemaGenerationResult {
    pathDefinition: any;
}

const ENUM_PATTERN = /enum:(.+)/;

export default class DocumentationService {
    static controllers: Array<ApiController>;
    private static openApiDefinition: any = null;

    static generateSchemaDescription(schema: SchemaDescription, excludeNames: Array<string>): SchemaGenerationResult {
        const dependencies: Array<SchemaDescription> = [schema];
        const result: any = {};
        const alreadySet: Array<string> = [];
        while (dependencies.length > 0) {
            const dependency = dependencies.pop();
            if (dependency != null && !excludeNames.includes(dependency.name)) {
                const parsing = DocumentationService.parseSchemaDescription(dependency);
                const newDependencies = parsing.dependencies.filter((dep) => !alreadySet.includes(dep.name) && !excludeNames.includes(dependency.name));
                dependencies.push(...newDependencies);
                result[dependency.name] = parsing.definition;
                alreadySet.push(dependency.name)
            }
        }
        return {definitions: result, generatedSchemaNames: alreadySet};
    }

    static parseSchemaDescription(schema: SchemaDescription): DefinitionParsing {
        if (schema == null) {
            return {definition: {}, dependencies: []};
        }
        const dependencies: Array<SchemaDescription> = [];
        const definition: any = {
            type: schema.type,
            description: schema.description,
            title: schema.description,
        };
        // TODO generateRef for enum and objects
        const enumExec = ENUM_PATTERN.exec(schema.type) || [null];
        switch (schema.type) {
            case enumExec[0]:
                definition.type = enumExec[1];
                definition.enum = schema.items;
                definition.default = schema.default;
                break;
            case "array":
                let items = null;
                if (schema.items instanceof String) {
                    items = schema.items;
                } else {
                    const refSchema = schema.items as SchemaDescription;
                    items = DocumentationService.generateRef(refSchema.name);
                    dependencies.push(refSchema);
                }
                definition.items = items;
                break;
            case "object":
                const requiredProperties: Array<string> = [];
                const properties: any = {};
                (schema.properties || []).forEach((property: SchemaDescription) => {
                    if (property.required) {
                        requiredProperties.push(property.name);
                    }
                    const result = DocumentationService.parseSchemaDescription(property);
                    properties[property.name] = result.definition;
                    dependencies.push(...result.dependencies);
                });
                definition.properties = properties;
                if (requiredProperties.length > 0) {
                    definition.required = requiredProperties;
                }
                break;
            default:
                DocumentationService.fillExistingParameters(schema, definition, ["default",
                    "format",
                    "pattern",
                    "example"]);
        }
        return {definition: definition, dependencies: dependencies};
    }

    private static fillExistingParameters(from: any, to: any, parameters: Array<string>) {
        parameters.forEach((param: string) => {
            if (Object.prototype.hasOwnProperty.call(from, param) !== null) {
                to[param] = from[param];
            }
        });
        return parameters;
    }

    private static generateRef(name: string) {
        return {"$ref": `#/components/schemas/${name}`};
    }

    public static inspectType(type: any, name: string): SchemaDescription | string {
        const typeOfType = typeof type;
        let typeAsString = "string";
        const staticTypes = ["string", "integer", "boolean", "number"];
        switch (typeOfType) {
            case "bigint":
                typeAsString = "integer";
                break;
            case "boolean":
                typeAsString = "boolean";
                break;
            case "function":
                typeAsString = "function";
                break;
            case "number":
                typeAsString = "number";
                break;
            case "string":
                typeAsString = type;
                break;
            case "symbol":
                typeAsString = "symbol";
                break;
            case "undefined":
                typeAsString = "undefined";
                break;
            case "object":
                const schema: SchemaDescription = {
                    name: name,
                    type: typeOfType
                };
                const properties: Array<SchemaDescription> = [];
                for (const key in Object.keys(type)) {
                    const property = type[key];
                    let _property = DocumentationService.inspectType(property, key);
                    if (staticTypes.includes(_property as string)) {
                        console.log(`${_property} is a string`);
                        _property = {
                            name: key,
                            type: _property as string
                        }
                    }
                    properties.push(_property as SchemaDescription);
                }
                schema.properties = properties;
                return schema;
        }
        return typeAsString;

    }

    public static getApiDefinition() {
        if (DocumentationService.openApiDefinition == null) {
            DocumentationService.openApiDefinition = DocumentationService.generateApiDefinition(openApiDefinition);
        }
        return DocumentationService.openApiDefinition;
    }


    private static generateApiDefinition(initialDefinition: any) {
        const excludeNames: Array<string> = [];
        DocumentationService.controllers.forEach(
            (controller: ApiController) => {
                controller.getRoutes().forEach(
                    (routing: Routing) => {
                        if (!routing.hasOwnProperty("protected")) {
                            routing.protected = controller.isProtected();
                        }
                        const res = DocumentationService.generateRoutingDoc(controller.getPath(), routing, controller.getTags(), excludeNames);
                        Object.assign(initialDefinition.paths, res.pathDefinition);
                        Object.assign(initialDefinition.components.schemas, res.definitions);
                        excludeNames.push(...res.generatedSchemaNames);
                    }
                )
            }
        );
        return initialDefinition;
    }


    private static generateRoutingDoc(prefix: string, routing: Routing, inheritedTags: Array<string>, excludeSchemas: Array<string>): PathResultResult {
        const pathObject: any = {};
        const status = routing.httpStatus || "200";
        let fullPath = `${prefix}${routing.path}`;
        const pathParameters: Array<SchemaDescription> = routing.pathParameters || [];
        const pathParameterNames = pathParameters.map( (pathParameter) => pathParameter.name);
        // retrieve path variables via RegExp matching :variable and not already defined
        (fullPath.match(/:(\w+)/g) || []).forEach((path) => {
            const _pathNormalized: string = path.slice(1);
            if (!pathParameterNames.includes(_pathNormalized)) {
                pathParameterNames.push(_pathNormalized);
                pathParameters.push({
                    name: _pathNormalized,
                    description: _pathNormalized,
                    type: "string",
                    required: true
                });
            }
        });
        // replace :variable by {variable}
        fullPath = fullPath.replace(/:(\w+)/g, "{$1}");
        const content: any = {};
        const alreadySetSchemas: Array<string> = [];
        content.summary = routing.summary;
        content.description = routing.description;
        content.tags = (routing.tags || []).concat(inheritedTags || []);
        const schemaDefinitions: any = {};
        const responses: any = {};
        let responseBody: any = {};
        if (routing.responseParameter) {
            responseBody = {schema: DocumentationService.generateRef(routing.responseParameter.name)};
            const res = DocumentationService.generateSchemaDescription(routing.responseParameter, alreadySetSchemas.concat(excludeSchemas));
            alreadySetSchemas.push(...res.generatedSchemaNames);
            Object.assign(schemaDefinitions, res.definitions);
        }
        responses[status] = {description: "Successful response", content: {"application/json": responseBody}};
        const parameters = pathParameters.map((p) => {
            const res = DocumentationService.generateParameter(p, [], "path");
            // alreadySetSchemas.push(...res.generatedSchemaNames);
            // Object.assign(schemaDefinitions, res.definitions); // do not add paths to schema definitions
            return res.parameterDefinition;
        });
        parameters.push(...(routing.queryParameters || []).map((p) => {
            const res = DocumentationService.generateParameter(p, [], "query");
            alreadySetSchemas.push(...res.generatedSchemaNames);
            Object.assign(schemaDefinitions, res.definitions);
            return res.parameterDefinition;
        }));
        let requestBody: any = null;
        if (routing.bodyParameter != null) {
            const bodyDefinition = DocumentationService.generateSchemaDescription(routing.bodyParameter, alreadySetSchemas.concat(excludeSchemas));
            Object.assign(schemaDefinitions, bodyDefinition.definitions);
            alreadySetSchemas.push(...bodyDefinition.generatedSchemaNames);
            requestBody = {"content": {"application/json": {"schema": DocumentationService.generateRef(routing.bodyParameter.name)}}, "required": true};
        }
        content.responses = responses;
        content.parameters = parameters;
        const security = [];
        if (routing.protected) {
            security.push({OAuth2PasswordBearer: []})
        }
        content.security = security;
        content.operationId = fullPath;
        if (requestBody) {
            content.requestBody = requestBody;
        }
        const _route: any = {};
        _route[routing.method] = content;
        pathObject[fullPath] = _route;
        return {pathDefinition: pathObject, definitions: schemaDefinitions, generatedSchemaNames: alreadySetSchemas};
    }


    private static generateParameter(schema: SchemaDescription, excludeNames: Array<string>, parameterType: string): ParameterResult {
        let schemaResult: SchemaGenerationResult;
        let _schema: any;
        if (["object", "array"].includes(schema.type) || ENUM_PATTERN.test(schema.type)) {
            _schema = DocumentationService.generateRef(schema.name);
            schemaResult = DocumentationService.generateSchemaDescription(schema, excludeNames);
        }
        else {
            _schema = {
                "title": schema.name,
                "type": schema.type
            };
            schemaResult = {
                generatedSchemaNames: [],
                definitions: {}
            }
        }
        const parameter = {
            "required": schema.required,
            "schema": _schema,
            "description": schema.description,
            "name": schema.name,
            "in": parameterType
        };
        return {parameterDefinition: parameter, ...schemaResult}
    }
}