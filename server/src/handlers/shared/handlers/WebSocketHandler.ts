import { WebSocket } from "ws";

export abstract class WebSocketHandler {
  abstract handleMessage<T = Object>(message: T): void
  websocketConnection: WebSocket
  /**
   * the active websocket for the (validated) user
   */
  constructor(webSocket: WebSocket) {
    this.websocketConnection = webSocket;
  }
}