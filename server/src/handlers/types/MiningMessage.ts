import { PlayerMessageTypes } from "../../shared/types/PlayerMessageTypes"

export type MiningMessage = {
  userId: string,
  characterID: string,
  type: PlayerMessageTypes.Mine,
  resourceID: string
}