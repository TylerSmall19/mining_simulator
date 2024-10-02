import { TiledResource } from "@excaliburjs/plugin-tiled";
import { EngineOptions, Loadable, Loader } from "excalibur";
import { CopperVein } from "./rendering/actors/resources/mining/ores/CopperVein";
import { ResourceFetcher } from "./rendering/actors/resources/utils/resourceFetcher";
import { APIImageSource } from "./rendering/image_classes/APIImageSource";
import { PlayerMiner } from "./rendering/actors/characters/PlayerMiner";
import { GameEngine } from "./resources/custom_classes/GameEngine";
import { APP_CONFIG } from "../globals/constants/config_consts";

let _gameEngine: GameEngine = new GameEngine();
const canvasId = 'game';

const gameFieldMetaData: EngineOptions = {
  height: APP_CONFIG.gameHeight,
  width: APP_CONFIG.gameWidth,
  maxFps: 120,
  canvasElementId: canvasId
}

/**
 * This is for initializing the game. Currently it will render the loader to the canvas with ID 'game'
 * 
 * @returns the game engine that was started by the script
 */
const init = () => {
  // After the game is started, check if 

  const loadableResources: Loadable<any>[] = [];
  const imageSource = new APIImageSource('/assets/maps/mining_maps/image_assets/copper_ore_1.png');
  ResourceFetcher.addResources(new Map([[CopperVein.key, imageSource]]));
  ResourceFetcher.addResources(new Map([[PlayerMiner.textureKey, new APIImageSource('/assets/characters/miners/male_miner_alt.png')]]));

  const tiledMap = new TiledResource(`${process.env.REACT_APP_API_ROOT_DOMAIN}/assets/maps/mining_maps/mine_area.tmj`, {
    useMapBackgroundColor: true,
    mapFormatOverride: 'TMJ',
    entityClassNameFactories: {
      ore: (props) => {
        const ore = new CopperVein({
          pos: props.worldPos,
          width: props.object?.tiledObject?.width || 32,
          height: props.object?.tiledObject?.height || 32,
          name: props.properties.name || props.object?.name,
          resourceDetails: props.properties as unknown as Map<string, any>
        });
        return ore;
      }
    }
  });

  const loader = new Loader({ 
    fullscreenAfterLoad: false,
    loadables: [tiledMap, ...(ResourceFetcher.fetchByKeys([CopperVein.key, PlayerMiner.textureKey]) || []), ...loadableResources]
  });

  _gameEngine = new GameEngine(gameFieldMetaData);
  // _gameEngine.toggleDebug();

  return _gameEngine.start(loader).then(() => {
    tiledMap.addToScene(_gameEngine.currentScene);
    return _gameEngine;
  });
};

export const gameScript = {
  getGameEngine: () => _gameEngine,
  canvasId,
  init,
  gameFieldMetaData
};