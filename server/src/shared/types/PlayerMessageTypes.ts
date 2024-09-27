/**
 * This is a list of valid types of messages a player can send.
 * Any other message types a websocket request contains will be ignored
 * 
 * This request will be routed to the appropriate handler for each request type
 * 
 * @param Move: Movement requests
 * @param Market: These are marketing related actions buy, sell, collect, etc. details are expected in the message itself
 */
export enum PlayerMessageTypes {
  Move = 'move',
  Mine = 'mine',
  Inventory = 'inventory',
  Market = 'market',
  StopMine = 'stopmine'
}