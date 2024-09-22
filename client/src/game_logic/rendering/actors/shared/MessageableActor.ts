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
    
    this.websocket = websocketArgs || new WebSocket(process.env.REACT_APP_WEBSOCKET_DOMAIN || '')
  }
}