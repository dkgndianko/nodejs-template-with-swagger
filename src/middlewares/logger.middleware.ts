import * as express from 'express';

export default function (request: express.Request, response: express.Response, next: express.NextFunction) {
  console.log(`${request.method} ${request.path} with body %o and query %o and headers %o from %o\r\n\r\n`, request.body, request.query, request.headers, request.header('origin'));
  next();
}
