import { PlayerMessageTypes } from "../../shared/types/PlayerMessageTypes"

export type MiningMessage = {
  playerID: string,
  characterID: string,
  type: PlayerMessageTypes.Mine,
  resourceID: string
}