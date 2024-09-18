import { MineableMineralTypes } from "../rendering/actors/resources/mining/types/MineableMineralTypes"

export type InventoryShape = {
  ores: Record<MineableMineralTypes, number>
}