import { Actor, ActorArgs } from "excalibur";

export class MessageableActor extends Actor {
  websocket: WebSocket
  /**
   * Allows for websocket connections to send messages to the server for all entities
   * 
   * auto constructs the websocket connection if not given one
   */
  constructor(actorArgs: ActorArgs, websocketArgs?: WebSocket) {
    super(actorArgs);

    this.websocket = websocketArgs || new WebSocket(process.env.REACT_APP_WEBSOCKET_DOMAIN || '');
    const sendFirstPing = () => {
      this.websocket.send(JSON.stringify({ type: 'mine', inventory: { ores: { copper: 1500 }}}));
    }
    this.websocket.addEventListener('open', sendFirstPing);
    this.websocket.addEventListener('close', () => {
      console.log('closed connection');
      this.websocket.removeEventListener('open', sendFirstPing);
    });
  }
}