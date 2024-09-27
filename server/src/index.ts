import { Application } from "express";
import { IndexHandler } from "./IndexHandler";
import dotenv from "dotenv";
import { ROUTE_CONSTANTS } from "./routeConstants";
import cors from 'cors';
import { createServer } from 'https';
import { readFileSync } from "fs";
import { WebSockets } from "./websockets";
import { Logger } from "./logger/Logger";
import mongoSanitize from "express-mongo-sanitize";
import { playerRouter } from "./routers/playerRoutes";
import bodyParser from "body-parser";
import express from 'express';

dotenv.config();
const app: Application = express();
const port = 3001;

// add middleware
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req.body);
    },
  }),
);

app.get(ROUTE_CONSTANTS.apiRoot, IndexHandler);
app.use(playerRouter);

const options = {
  cert: readFileSync('./.cert/localhost+2.pem'),
  key: readFileSync('./.cert/localhost+2-key.pem'),
};

// Create the HTTP server
const server = createServer(options, app);

// Start the server
server.listen(port, () => {
  Logger.info('Server listening on port ' + port + '\n\r');
});

WebSockets(server)
.catch((e) => {
  Logger.error('something is wrong with the websockets:', e);
});

export default app;