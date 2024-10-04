import { SET_ACTIVE_PLAYER_EVENT } from "../../../shared/customEvents";
import { PlayerDetails } from "../../../types/ActivePlayerTypes";
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

  it.skip('sends a SetActivePlayerEvent upon storage', () => {
    const expected = {
      _id: 'test-foo',
      playerName: 'lil bunny_foo-foo 4'
    } as PlayerDetails;
    expect.assertions(3);
    const engineToTest = new GameEngine();
    engineToTest.activePlayer = expected;
    expect(engineToTest.activePlayer).toEqual(expected);
    const callback = (e: any) => {
      expect(e.detail?.activePlayer).toEqual(expected);
    }
    window.addEventListener(SET_ACTIVE_PLAYER_EVENT, callback);

    window.removeEventListener(SET_ACTIVE_PLAYER_EVENT, callback);
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
    expect(engineToTest.activePlayer).toEqual(expected);
  });

  it('sets the player to null when given null', () => {
    jest.spyOn(Storage.prototype, 'setItem');
    const expected = {
      _id: 'test-foo',
      playerName: 'lil bunny_foo-foo'
    } as PlayerDetails;
    const engineToTest = new GameEngine({ activePlayer: expected });
    expect(engineToTest.activePlayer).toEqual(expected);
    engineToTest.activePlayer = null;
    expect(engineToTest.activePlayer).toBeNull();
  });

  it.todo('Work on refactoring the UIWrapper canvas')

  describe('getActivePlayer', () => {
    it('can fetch the player as an object from localStorage', () => {
      const expected = {
        _id: 'test-foo',
        playerName: 'lil bunny_foo-foo'
      } as PlayerDetails;
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => JSON.stringify(expected));
      const engineToTest = new GameEngine();
      expect(engineToTest.activePlayer).toEqual(expected);
      expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    it('returns null but does not throw an exception when invalid JSON is passed to JSON.parse', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => 'soooooo not a JSON object');
      const engineToTest = new GameEngine();
      expect(() => engineToTest.activePlayer).not.toThrow();
      expect(engineToTest.activePlayer).toBeNull();
    });

    it('can fetch the player as an object when given to the constructor', () => {
      const expected = {
        _id: 'test-foo',
        playerName: 'lil bunny_foo-foo'
      } as PlayerDetails;
      const engineToTest = new GameEngine({ activePlayer: expected });
      expect(engineToTest.activePlayer).toEqual(expected);
      expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    it('returns null when no object is present in localStorage', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
      const engineToTest = new GameEngine();
      expect(engineToTest.activePlayer).toBeNull();
    });

    it('returns null when given an undefined player', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
      const engineToTest = new GameEngine({ activePlayer: undefined });
      expect(engineToTest.activePlayer).toBeNull();
    });

    it('returns null when given a null player', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
      // TS protects against this edge case, but the API response could be unexpected, so just in case
      // @ts-ignore
      const engineToTest = new GameEngine({ activePlayer: null });
      expect(engineToTest.activePlayer).toBeNull();
    });

    it('returns the player pulled from localStorage even if an object is given in the constructor.', () => {
      const expected = {
        _id: 'test-foo',
        playerName: 'lil bunny_foo-foo'
      } as PlayerDetails;

      const notExpected = {
        _id: 'test-foo-FAKE',
        playerName: 'lil bunny_foo-foo yoyo'
      } as PlayerDetails;

      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => JSON.stringify(expected));
      const engineToTest = new GameEngine({ activePlayer: notExpected });
      expect(engineToTest.activePlayer).toEqual(expected);
    });
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