import {NextFunction, Request, Response} from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', req.headers.origin ? req.headers.origin as string : '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
}
