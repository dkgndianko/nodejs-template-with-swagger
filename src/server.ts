import App from "./app";
import DocumentationController from "./docs/documentationController";
import AuthenticationController from "./api/auth/authenticationController";

const port = +(process.env.PORT || 4000);
const app = new App([new DocumentationController(), new AuthenticationController()], port);
export default app;
