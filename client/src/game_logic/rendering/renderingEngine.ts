import { CollisionType } from "excalibur";
import { gameScript } from "../";
import { PlayerMiner } from "./actors/characters/PlayerMiner";

const startGame = () => {
  const player = new PlayerMiner({
    x: gameScript.getGameEngine().drawWidth / 2 - 15,
    y: gameScript.getGameEngine().drawHeight - 40,
    collisionType: CollisionType.Active
  });
  gameScript.getGameEngine().add(player);
};

export const renderingEngine = {
  startGame
};