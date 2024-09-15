import { Actor } from "excalibur";
import { Rarities, RarityModifiers } from "./mining/types/Mineable";
import { MineableMineralTypes } from "./mining/types/MineableMineralTypes";

export abstract class HarvestableResource extends Actor {
  capacity: number = 0;
  rarity: Rarities = Rarities.Common;
  abstract name: string;
  abstract resourceType: MineableMineralTypes;

  harvest(miningAmount: number): number {
    const modifiedAmount = miningAmount * (RarityModifiers[this.rarity] || 1);
    if (this.capacity > this.capacity - modifiedAmount) {
      this.capacity -= modifiedAmount
      return modifiedAmount;
    } else {
      this.kill();
      return this.capacity
    }
  }
}