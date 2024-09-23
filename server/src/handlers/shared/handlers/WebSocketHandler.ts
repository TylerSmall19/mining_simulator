import { WebSocket } from "ws";

export abstract class WebSocketHandler {
  abstract handleMessage(message: any): Promise<void>
  websocketConnection: WebSocket
  /**
   * the active websocket for the (validated) user
   */
  constructor(webSocket: WebSocket) {
    this.websocketConnection = webSocket;
  }
}