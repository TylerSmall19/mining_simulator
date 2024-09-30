import { InventoryShape } from "../game_logic/inventory/PlayerInventoryTypes";
import { PlayerDetails } from "./types/ActivePlayerTypes";

export const ADD_ITEM_EVENT = 'addItemToInventory';
export const SET_ACTIVE_PLAYER_EVENT = 'setActivePlayerEvent'

export type AddItemEventShape = { newInventory: InventoryShape };
export type SetActivePlayerShape = { activePlayer: PlayerDetails };

declare global {
  interface WindowEventMap {
    [ADD_ITEM_EVENT]: CustomEvent<AddItemEventShape>;
    [SET_ACTIVE_PLAYER_EVENT]: CustomEvent<SetActivePlayerShape>
  }
}

export class SetActivePlayerEvent extends CustomEvent<SetActivePlayerShape> {
  constructor(init: CustomEventInit<SetActivePlayerShape>) {
    super(SET_ACTIVE_PLAYER_EVENT, init);
  }
}

export class AddItemEvent extends CustomEvent<AddItemEventShape> {
  constructor(init: CustomEventInit<AddItemEventShape>) {
    super(ADD_ITEM_EVENT, init);
  }
}