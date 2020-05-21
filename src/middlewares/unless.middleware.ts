import unless from 'express-unless';
import {RequestHandler} from 'express';

/**
 * This function avoid usage of a middleware if matching some options.
 * It is based on `unless-express` see https://www.npmjs.com/package/express-unless
 * @param middleware: {RequestHandler} The original middleware
 * @param options: {unless.Options} options to check for matching
 * @return {unless.RequestHandler} the middleware with __unless__ function defined.
 */
export function unlessMatching(middleware: RequestHandler, options: unless.Options) {
    const newMiddleware: unless.RequestHandler = middleware;
    newMiddleware.unless = unless;
    return newMiddleware.unless(options);
}