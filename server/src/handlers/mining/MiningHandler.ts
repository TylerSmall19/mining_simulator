import { WebSocketHandler } from "../shared/handlers/WebSocketHandler";

enum MineableMineralType {
  Copper = 'copper'
}

// MiningMessage

export class MiningHandler extends WebSocketHandler {
  // MiningMessage type
  handleMessage<T>(message: T): void {
    if (message)
    this.websocketConnection.send(JSON.stringify({ 
      messageType: 'harvesting',
      amount: 100,
      oreType: MineableMineralType.Copper
    }));
  }

  userId: string = '';
  playerInventory: any = {};

  harvestResource(resourceID: string) {
    return !!resourceID;
  }
}