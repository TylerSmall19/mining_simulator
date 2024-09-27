import { Logger } from "../../logger/Logger";
import { PlayerUserDetailsRepo } from "../../repositories/PlayerUserDetailsRepo";
import { MessageTypes } from "../../shared/messages/MessageTypes";
import { PlayerMessageTypes } from "../../shared/types/PlayerMessageTypes";
import { WebSocketHandler } from "../shared/handlers/WebSocketHandler";
import { MiningMessage } from "../types/MiningMessage";

enum MineableMineralType {
  Copper = 'copper'
}

export class MiningHandler extends WebSocketHandler {
  miningIntervalIDs: NodeJS.Timeout[] = [];
  playerCharRepo: PlayerUserDetailsRepo = new PlayerUserDetailsRepo();

  async handleMessage(message: MiningMessage, stopMining?: boolean): Promise<void> {
    if (stopMining) {
      this.miningIntervalIDs.forEach((timeout) => {
        clearInterval(timeout);
      })
    }
    if (message && message.type === PlayerMessageTypes.Mine) {
      // Pull the user by UserID

      // Pull the playerChar from playerCharID

      // Verify the locations of each resource
      // const playerCharRepo = new PlayerUserDetailsRepo();

      try {
        // pull the player data from the DB
        const playerCharacter = await this.playerCharRepo.getPlayerbyID(message.playerID);
        // Pull the resource from the DB

        // Do the required math for the modifier of base and rarity
        // hardcoded into the DB: 66f2d819a35876bd34a37c0c
        const minerCharacter = playerCharacter.characters.find((char) => char._id.toString() === message.characterID)
        if (minerCharacter) {
          const characterBaseAmount = minerCharacter.stats.mining.baseAmount;
          const miningInterval = minerCharacter.stats.mining.miningInterval;

          // Set the timer to send the message to the client
          this.miningIntervalIDs.push(setInterval(() => {
            if (this.websocketConnection)
              this.websocketConnection.send(JSON.stringify({
                msg: 
                {
                  messageType: MessageTypes.Mining,
                  amount: characterBaseAmount,
                  oreType: MineableMineralType.Copper
                },
                character: minerCharacter,
                player: playerCharacter
              }));
          }, miningInterval))
        } else
          throw new Error (`character not found on player: userID: ${message.playerID} charID: ${message.characterID}`);
      } catch (e) {
        Logger.error('Something went wrong in the Mining Handler:', e)
      }
    }
  }

  userId: string = '';
  playerInventory: any = {};

  harvestResource(resourceID: string) {

    return !!resourceID;
  }
}