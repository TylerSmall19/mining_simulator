import { Server } from "https";
import { RawData, WebSocket } from "ws";
import { safeJsonParse } from "../utils/parseUtils";
import { MineableMineralTypes } from "../shared/types/MineableMineralTypes";
import { PlayerMessageTypes } from "../shared/types/PlayerMessageTypes";
import { MiningHandler } from "../handlers/mining/MiningHandler";

type WebsocketMessage = {
  messageType: PlayerMessageTypes,
}

type MiningMessage = {
  resourceType: MineableMineralTypes,
  resourceID: string
} & WebsocketMessage

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
      console.log('Connection made!')
      websocketConnection.on("message", (message: RawData, isBinary: boolean) => { 
        if (isBinary)
          return

        try {
          const parsedMessage = safeJsonParse<WebsocketMessage>(message.toString());
          switch (parsedMessage?.messageType) {
            case PlayerMessageTypes.Mine:
              new MiningHandler((websocketConnection as unknown) as WebSocket)
              break;
          
            default:
              break;
          }
          console.log('This is the parsed message', parsedMessage);
          websocketConnection.send(JSON.stringify({
            message: 'There be gold in them thar hills.'
          }));
        } catch (ex) {
          console.log('Something went wrong', ex)
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
