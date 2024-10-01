import { Engine, EngineOptions } from "excalibur";
import { cloneDeep } from "lodash";
import { PlayerDetails } from "../../../globals/types/ActivePlayerTypes";
import { SetActivePlayerEvent } from "../../../globals/customEvents";
import { isEqual } from 'lodash'

export class GameEngine extends Engine {
  /** this is in place to prevent render loops when this is consumed in the React hook */
  private _activePlayerCache: PlayerDetails | null = null;
  private _activePlayer: PlayerDetails | null = null;
  _activePlayerStorageKey = 'activePlayer';
  constructor(options?: EngineOptions & { activePlayer?: PlayerDetails }) {
    super(options);
    if (options?.activePlayer) {
      this.activePlayer = options.activePlayer;
    }
  }

  /**
   * returns an **immutible** copy of the player (a deep cone of the value)
   * 
   * This is a requirement for subscribing to the value from the React hook used later.
   */
  get activePlayer() {
    const playerStringFromStorage = window.localStorage.getItem(this._activePlayerStorageKey);
    let playerToReturn: PlayerDetails | null = null;
    if (playerStringFromStorage) {
      try {
        playerToReturn = JSON.parse(playerStringFromStorage);
      } catch (e) {
        console.error('Parsing failed:', e);
      }
    } else if (this._activePlayer) {
      playerToReturn = cloneDeep(this._activePlayer);
    }
    if (isEqual(playerToReturn, this._activePlayerCache))
      return  this._activePlayerCache 
    else {
      this._activePlayerCache = playerToReturn;
      return playerToReturn;
    }
  }

  /**
   * Prioritizes using window.localstorage first since it can stick around after refresh.
   * 
   * _activePlayer is an internal fallback in case localstorage access isn't allowed for some reason
   */
  set activePlayer(activePlayer: PlayerDetails | null) {
    if (activePlayer) {
      window.localStorage.setItem(this._activePlayerStorageKey, JSON.stringify(activePlayer));
      this._activePlayer = activePlayer;
      window.dispatchEvent(new SetActivePlayerEvent({ detail: { activePlayer }}));
      console.log('Setting player', activePlayer)
    } else {
      window.localStorage.removeItem(this._activePlayerStorageKey);
      window.dispatchEvent(new SetActivePlayerEvent({ detail: undefined}));
      this._activePlayer = null;
      console.log('Removing player', activePlayer)
    }
  }
}