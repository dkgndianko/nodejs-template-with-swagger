export const openApiDefinition = {
    openapi: "3.0.2",
    info: {
        title: "Test App API",
        description: "this API is for testing",
        termsOfService: "http://ctsfares.com",
        version: "1.0.0",
        contact: {
            "name": "Mouhamad ND. THIAM",
            "url": "http://dkgndianko.tech",
            "email": "thiamouhamadpro@gmail.com"
        },
        license: {
            "name": "Apache 2.0",
            "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
        }
    },
    paths: {

    },
    security: {
        OAuth2PasswordBearer: [],
    },
    components: {
        schemas: {

        },
        securitySchemes: {
            OAuth2PasswordBearer: {
                type: "oauth2",
                flows: {
                    password: {
                        scopes: {

                        },
                        tokenUrl: "/api/auth/token"
                    }
                }
            }
        }
    }
};