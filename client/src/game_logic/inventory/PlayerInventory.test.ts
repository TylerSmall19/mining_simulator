import { ADD_ITEM_EVENT } from "../../shared/customEvents";
import { MineableMineralTypes } from "../rendering/actors/resources/mining/types/MineableMineralTypes";
import { PlayerInventory } from "./PlayerInventory"
import { InventoryShape } from "./PlayerInventoryTypes";

describe('PlayerInventory', () => {
  it('initalizes empty', () => {
    const playerInventory = new PlayerInventory();
    expect(playerInventory.itemCount).toBe(0);
  });

  it('initalizes with the given inventory', () => {
    const givenInv = { ores: { copper: 500 } } as InventoryShape;
    const inv = new PlayerInventory(givenInv);
    expect(inv.itemCount).toBe(500);
    expect(inv.items).toEqual(givenInv);
  });

  it('adds an item when recognized items are given', async () => {
    expect.assertions(4);
    const givenInv = { ores: { copper: 500 } } as InventoryShape;
    const expectedInv = { ores: { copper: 1500 } } as InventoryShape;
    const inv = new PlayerInventory(givenInv);
    expect(inv.itemCount).toBe(500);
    expect(inv.items).toEqual(givenInv);

    inv.addItem(MineableMineralTypes.Copper, 1000).then(val => {
      expect(val).toEqual(expectedInv);
      expect(inv.itemCount).toBe(1500);
    })
  })

  it('emits an event when you add a new item', async () => {
    expect.assertions(1);
    const givenInv = { ores: { copper: 500 } } as InventoryShape;
    const expectedInv = { ores: { copper: 1500 } } as InventoryShape;
    const inv = new PlayerInventory(givenInv);
    let eventInv = {};
    window.addEventListener(ADD_ITEM_EVENT, (ev) => {
      eventInv = ev.detail.newInventory
    })
    await inv.addItem(MineableMineralTypes.Copper, 1000);
    expect(eventInv).toEqual(expectedInv);
    window.removeEventListener(ADD_ITEM_EVENT, (ev) => {
      eventInv = ev.detail.newInventory
    });
  })

  describe('snapshot', () => {
    it('returns a copy of the object that doesnt change on update', async () => {
      expect.assertions(5);
      const givenInv = { ores: { copper: 500 } } as InventoryShape;
      const expectedInv = { ores: { copper: 1000 } } as InventoryShape;
      const inv = new PlayerInventory(givenInv);
      expect(inv.itemCount).toBe(500);
      expect(inv.items).toEqual(givenInv);
      const snapshot = inv.snapshot;
      expect(snapshot).toEqual(givenInv)
      inv.addItem(MineableMineralTypes.Copper, 500).then((val) => {
        expect(val).toEqual(expectedInv);
        expect(snapshot).toEqual({ ores: { copper: 500 } });
      })
    })
  })
})