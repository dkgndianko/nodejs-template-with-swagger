import {
    cleanEnv, str, port
} from 'envalid';

export default function validateEnv() {
    cleanEnv(process.env, {
        APP_NAME: str(),
        PORT: port(),
        NODE_ENV: str(),
        DATABASE_USER: str(),
        DATABASE_PASSWORD: str(),
        DATABASE_NAME: str(),
        DATABASE_HOST: str()
    });
}
