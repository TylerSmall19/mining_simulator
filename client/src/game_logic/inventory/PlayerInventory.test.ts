import { MineableMineralTypes } from "../rendering/actors/resources/mining/types/MineableMineralTypes";
import { InventoryShape, PlayerInventory } from "./PlayerInventory"

describe('PlayerInventory', () => {
  it('initalizes empty', () => {
    const playerInventory = new PlayerInventory();
    expect(playerInventory.itemCount).toBe(0);
  });

  it('initalizes with the given inventory', () => {
    const givenInv = { ores: { copper: 500 } } as InventoryShape;
    const inv = new PlayerInventory(givenInv);
    expect(inv.itemCount).toBe(500);
    expect(inv.inventory).toEqual(givenInv);
  });

  it('adds an item when recognized items are given', async () => {
    expect.assertions(4);
    const givenInv = { ores: { copper: 500 } } as InventoryShape;
    const expectedInv = { ores: { copper: 1500 } } as InventoryShape;
    const inv = new PlayerInventory(givenInv);
    expect(inv.itemCount).toBe(500);
    expect(inv.inventory).toEqual(givenInv);

    inv.addItem(MineableMineralTypes.Copper, 1000).then(val => {
      expect(val).toEqual(expectedInv);
      expect(inv.itemCount).toBe(1500);
    })
  })
})