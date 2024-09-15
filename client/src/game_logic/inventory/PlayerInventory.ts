import { MineableMineralTypes } from "../rendering/actors/resources/mining/types/MineableMineralTypes";

export type InventoryShape = {
  ores: Record<MineableMineralTypes, number>
}

export class PlayerInventory {
  private _inventory: InventoryShape = {
    ores: { copper: 0, coal: 0, iron: 0, lead: 0, silver: 0, tin: 0 }
  } as InventoryShape;

  constructor(inv?: InventoryShape) {
    if (inv) {
      this._inventory = inv;
    }
  }

  async addItem(itemName: MineableMineralTypes, quantity: number): Promise<InventoryShape> {
    this._inventory.ores[itemName] += quantity;
    return this._inventory;
  }

  get itemCount(): number {
    return Object.values(this._inventory).map((val) => {
      return (Object.values(val) || []).reduce((acc, val) => {
        return (acc + val)
      }, 0);
    }).reduce((acc, val) => (acc + val), 0)
  }

  get inventory(): InventoryShape {
    return this._inventory;
  }
}