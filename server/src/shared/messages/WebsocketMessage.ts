import { PlayerMessageTypes } from "../types/PlayerMessageTypes";

export type WebsocketMessage = {
  userId: 'string',
  messageType: PlayerMessageTypes,
};

export type WebsocketClientMessage = {
  
} & WebsocketMessage;

export type WebsocketServerMessage = {
  messageType: 'mining' | 'movement' | 'inventory',
} & WebsocketMessage;