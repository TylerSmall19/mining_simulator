import { PlayerDetails } from "../../../globals/types/ActivePlayerTypes";
import { GameEngine } from "./GameEngine";

describe('GameEngine', () => {
  beforeAll(() => {
    // @ts-ignore
    HTMLCanvasElement.prototype.getContext = () => {};
    HTMLCanvasElement.prototype.toDataURL = () => '';
    jest.mock('excalibur');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('stores the given active player', () => {
    const expected = {
      _id: 'test-foo',
      playerName: 'lil bunny_foo-foo'
    } as PlayerDetails;

    const engineToTest = new GameEngine();
    expect(engineToTest.activePlayer).toBeNull();
    engineToTest.activePlayer = expected;
    expect(engineToTest.activePlayer).toEqual(expected);
  });

  it('stores the given active player from the constructor', () => {
    const expected = {
      _id: 'test-foo',
      playerName: 'lil bunny_foo-foo'
    } as PlayerDetails;

    const engineToTest = new GameEngine({ activePlayer: expected });
    expect(engineToTest.activePlayer).toEqual(expected);
  });

  it('returns an immutible copy', () => {
    const expected = {
      _id: 'test-foo',
      playerName: 'lil bunny_foo-foo'
    } as PlayerDetails;

    const engineToTest = new GameEngine({ activePlayer: expected });
    const player = engineToTest.activePlayer;
    player!._id = 'not a test test ID'
    expect(engineToTest.activePlayer?._id).toEqual('test-foo');
  });

  it('stores the object into localStorage with the activePlayerStorageKey', () => {
    jest.spyOn(Storage.prototype, 'setItem');
    const expected = {
      _id: 'test-foo',
      playerName: 'lil bunny_foo-foo'
    } as PlayerDetails;
    expect(window.localStorage.setItem).not.toHaveBeenCalled();
    const engineToTest = new GameEngine({ activePlayer: expected });
    expect(window.localStorage.setItem).toHaveBeenCalledWith(engineToTest._activePlayerStorageKey, JSON.stringify(expected));
    expect(engineToTest.activePlayer?._id).toEqual('test-foo');
  });

  // it('returns the object from memory when it cannot find it in localstorage', () => {
  //   jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { console.error('This is called'); return null});
  //   const expected = {
  //     _id: 'test-foo',
  //     playerName: 'lil bunny_foo-foo'
  //   } as PlayerDetails;
  //   expect(window.localStorage.setItem).not.toHaveBeenCalled();
  //   const engineToTest = new GameEngine();
  //   expect(window.localStorage.setItem).toHaveBeenCalledWith(engineToTest._activePlayerStorageKey, JSON.stringify(expected));
  //   expect(engineToTest.activePlayer?._id).toEqual('test-foo');
  // });
});