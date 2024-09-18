import { ADD_ITEM_EVENT, AddItemEvent } from "../../global_events/customEvents";
import { MineableMineralTypes } from "../rendering/actors/resources/mining/types/MineableMineralTypes";
import { InventoryShape } from "./PlayerInventoryTypes";

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
    this._inventory = {
      ...this._inventory,
      ores: { 
        ...this._inventory.ores, 
        [itemName]: this._inventory.ores[itemName] + quantity
      }
    }
    window.dispatchEvent(new AddItemEvent({ detail: { newInventory: this.snapshot } }))
    return this.items;
  }

  get itemCount(): number {
    return Object.values(this._inventory).map((val) => {
      return (Object.values(val) || []).reduce((acc, val) => {
        return (acc + val)
      }, 0);
    }).reduce((acc, val) => (acc + val), 0)
  }

  get items(): InventoryShape {
    return this._inventory;
  }

  /*
  * This will return a snapshot of the object as a deep clone with no connections to the object
  */
  get snapshot(): InventoryShape {
    return JSON.parse(JSON.stringify(this._inventory));
  }
}