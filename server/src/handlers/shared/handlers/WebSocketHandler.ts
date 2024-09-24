import { WebSocket } from "ws";
import { Logger } from "../../../logger/Logger";

export abstract class WebSocketHandler {
  abstract handleMessage(message: any, options: any): Promise<void>
  websocketConnection: WebSocket | null = null;
  /**
   * the active websocket for the (validated) user
   */
  constructor(webSocket?: WebSocket) {
    Logger.info('I am starting a new websocket Handler instance');
    if (webSocket)
      this.websocketConnection = webSocket;
  }

  saveWebsocketConnection(websocket: WebSocket) {
    this.websocketConnection = websocket;
  }
}