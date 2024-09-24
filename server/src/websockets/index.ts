import { Server } from "https";
import { RawData, WebSocket } from "ws";
import { safeJsonParse } from "../utils/parseUtils";
import { PlayerMessageTypes } from "../shared/types/PlayerMessageTypes";
import { MiningHandler } from "../handlers/mining/MiningHandler";
import { Logger } from "../logger/Logger";
import { MiningMessage } from "../handlers/types/MiningMessage";

type WebsocketMessage = {
  type: PlayerMessageTypes,
}
export const WebSockets = async (httpsServer: Server) => {
  const websocketServer = new WebSocket.Server({
    noServer: true,
    path: "/websockets",
  });

  httpsServer.on("upgrade", (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit("connection", websocket, request);
    });
  });

  websocketServer.on(
    "connection",
    (websocketConnection, req) => {
      // spin up the handlers
      const miningHandler = new MiningHandler();

      Logger.info('Connection made!')
      websocketConnection.on("message", (message: RawData, isBinary: boolean) => {
        if (isBinary)
          return

        miningHandler.saveWebsocketConnection(websocketConnection);
        try {
          const parsedMessage = safeJsonParse<WebsocketMessage>(message.toString());
          switch (parsedMessage?.type) {
            case PlayerMessageTypes.Mine:
              miningHandler.handleMessage(parsedMessage as MiningMessage);
              break;
            case PlayerMessageTypes.StopMine:
              miningHandler.handleMessage(parsedMessage as MiningMessage, true);
              break;
            default:
              break;
          }
          Logger.info('This is the parsed message', parsedMessage);
        } catch (ex) {
          Logger.error('Something went wrong', ex)
        }
      });
    }
  );

  return websocketServer;
};

// // WebSocket handling for real-time data and WebRTC signaling
// wss.on('connection', (ws: WebSocket) => {
//   console.log('WebSocket client connected');

//   // Handle messages from clients
//   ws.on('message', (message: string) => {
//     const data = JSON.parse(message);

//     // Handle trading operations
//     if (data.type === 'placeOrder') {
//       processTradeOrder(data);
//     }

//     // Handle WebRTC signaling
//     if (data.type === 'offer' || data.type === 'answer' || data.type === 'candidate') {
//       sendToPeer(data.targetPeerId, data);
//     }
//   });

//   // Example: Sending periodic market data to the client
//   setInterval(() => {
//     const marketData = getLiveMarketData();
//     ws.send(JSON.stringify(marketData));
//   }, 1000);
// });
