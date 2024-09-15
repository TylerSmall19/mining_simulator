import { Actor, ActorArgs } from "excalibur";
import { Rarities, RarityModifiers } from "./mining/types/Mineable";

export class HarvestableResource extends Actor {
  capacity: number = 0;
  rarity: Rarities = Rarities.Common;
  name: string = '';

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

  constructor(args: ActorArgs) {
    super(args);
  }
}