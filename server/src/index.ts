import { Application } from "express";
import { IndexHandler } from "./IndexHandler";
import dotenv from "dotenv";
import { ROUTE_CONSTANTS } from "./routeConstants";
import cors from 'cors';
import { createServer } from 'https';
import { readFileSync } from "fs";
import { WebSockets } from "./websockets";

dotenv.config();
const express = require('express');
const app: Application = express();
const port = 3001;

// add middleware for json
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.get(ROUTE_CONSTANTS.apiRoot, IndexHandler);

const options = {
  cert: readFileSync('./.cert/localhost+2.pem'),
  key: readFileSync('./.cert/localhost+2-key.pem'),
};

// Create the HTTP server
const server = createServer(options, app);

// Start the server
server.listen(port, () => {
  console.log('Server listening on port ' + port + '\n\r');
});

WebSockets(server)
.catch((e) => {
  console.error('something is wrong with the websockets:', e);
});

export default app;