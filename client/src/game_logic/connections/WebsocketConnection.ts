export class WebsocketConnection {
  static connection: WebSocket
  static async init(): Promise<boolean> {
    this.connection = new WebSocket(process.env.REACT_APP_WEBSOCKET_DOMAIN || '');
    // return this.connection.onopen(,)
    return true;
  }
}