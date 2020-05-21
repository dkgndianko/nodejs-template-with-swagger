import {SchemaDescription} from "../../docs/types";

export const UserDataDoc: SchemaDescription = {
    name:"UserData",
    description: "body of user Data",
    type: "object",
    example: {},
    properties:[
        {
            description: "username",
            type: "string",
            example: "dkgndianko",
            name: "username"
        }
    ]
};

export const UserDataResp: SchemaDescription = {
    description: "Response of token",
    name: "Token",
    type: "string",
};
