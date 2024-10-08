import { TiledResource } from "@excaliburjs/plugin-tiled";
import { Engine, EngineOptions, Loadable, Loader } from "excalibur";
import { CopperVein } from "./rendering/actors/resources/mining/ores/CopperVein";
import { ResourceFetcher } from "./rendering/actors/resources/utils/resourceFetcher";
import { APIImageSource } from "./rendering/image_classes/APIImageSource";
import { PlayerMiner } from "./rendering/actors/characters/PlayerMiner";

let GameEngine: Engine = new Engine() as Engine;
const canvasId = 'game';

const gameFieldMetaData: EngineOptions = {
  height: 600,
  width: 800,
  maxFps: 120,
  canvasElementId: canvasId
}

const init = () => {
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

  GameEngine = new Engine(gameFieldMetaData);
  GameEngine.toggleDebug();

  return GameEngine.start(loader).then(() => {
    tiledMap.addToScene(GameEngine.currentScene);
  });
};

export const gameScript = {
  getGameEngine: () => GameEngine,
  canvasId,
  init,
  gameFieldMetaData
};