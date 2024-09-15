import { CollisionType } from "excalibur";
import { gameScript } from "../gameScript";
import { PlayerMiner } from "./actors/characters/playerMiner";

const startGame = () => {
  const player = new PlayerMiner({
    x: gameScript.getGameEngine().drawWidth / 2 - 15,
    y: gameScript.getGameEngine().drawHeight - 40,
    collisionType: CollisionType.Active
  });
  console.log('Player added:', player)
  gameScript.getGameEngine().add(player);
};

export const renderingEngine = {
  startGame
};