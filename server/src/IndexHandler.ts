import { File } from "buffer";
import { Request, Response } from "express";


export const IndexHandler = (req: Request, res: Response) => {
  res.statusCode = 200;
  res.contentType('application/json')
  res.send({ hello: 'world!' });
}