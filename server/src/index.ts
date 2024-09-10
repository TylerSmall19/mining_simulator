import { Application, Request, Response } from "express";
import { IndexHandler } from "./IndexHandler";
import dotenv from "dotenv";
import { ROUTE_CONSTANTS } from "./routeConstants";
import cors from 'cors';

dotenv.config();
const express = require('express');
const app: Application = express();
const port = 3001;

// add middleware for json
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.get(ROUTE_CONSTANTS.apiRoot, IndexHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app;