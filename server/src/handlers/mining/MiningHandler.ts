import { Logger } from "../../logger/Logger";
import { PlayerCharacterRepo } from "../../repositories/PlayerCharacterRepo";
import { MessageTypes } from "../../shared/messages/MessageTypes";
import { PlayerMessageTypes } from "../../shared/types/PlayerMessageTypes";
import { WebSocketHandler } from "../shared/handlers/WebSocketHandler";
import { MiningMessage } from "../types/MiningMessage";

enum MineableMineralType {
  Copper = 'copper'
}

export class MiningHandler extends WebSocketHandler {
  async handleMessage(message: MiningMessage): Promise<void> {
    if (message && message.type === PlayerMessageTypes.Mine) {
      // Pull the user by UserID

      // Pull the playerChar from playerCharID

      // Verify the locations of each resource
      const playerCharRepo = new PlayerCharacterRepo();

      try {
        const playerCharacter = await playerCharRepo.getCharacterByID(message.characterID);
        // Pull the resource from the DB
        
        // Do the required math for the modifier of base and rarity
        const amount = playerCharacter.baseMiningAmount;
        const miningInterval = 300;
        
        // Set the timer  send the message to the client
        setInterval(() => {
          this.websocketConnection.send(JSON.stringify({
            messageType: MessageTypes.Mining,
            amount: amount,
            oreType: MineableMineralType.Copper
          }));
        }, miningInterval)
      } catch (e) {
        Logger.error('Something went wrong in the Mining Handler:', e)
      } finally {
        await playerCharRepo.closeClient();
      }
    }
  }

  userId: string = '';
  playerInventory: any = {};

  harvestResource(resourceID: string) {
    return !!resourceID;
  }
}