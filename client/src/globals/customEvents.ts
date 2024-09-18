import { InventoryShape } from "../game_logic/inventory/PlayerInventoryTypes";

export const ADD_ITEM_EVENT = 'add-item-to-inventory';

declare global {
  interface WindowEventMap {
    [ADD_ITEM_EVENT]: CustomEvent<AddItemEventShape>;
  }
}

export type AddItemEventShape = { newInventory: InventoryShape };

export class AddItemEvent extends CustomEvent<AddItemEventShape> {
  /**
   *
   */
  constructor(init: CustomEventInit<AddItemEventShape>) {
    super(ADD_ITEM_EVENT, init);
  }
}

export {}