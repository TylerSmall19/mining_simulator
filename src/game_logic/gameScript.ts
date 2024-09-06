import { Engine, EngineOptions } from "excalibur";

let GameEngine: Engine = {} as Engine;
const canvasId = 'game';
const gameFieldMetaData: EngineOptions = {
  height: 600,
  width: 800,
  maxFps: 120,
  canvasElementId: canvasId
}

const init = () => {
  GameEngine = new Engine(gameFieldMetaData);
  return GameEngine.start();
};

export const gameScript = {
  getGameEngine: () => GameEngine,
  canvasId,
  init,
  gameFieldMetaData
};