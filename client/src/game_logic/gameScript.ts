import { TiledResource } from "@excaliburjs/plugin-tiled";
import { CollisionType, Color, Engine, EngineOptions, ImageSource, Loadable, Loader } from "excalibur";
import { CopperVein } from "./rendering/actors/resources/mining/ores/CopperVein";
import { ResourceFetcher } from "./rendering/actors/resources/utils/resourceFetcher";

let GameEngine: Engine = {} as Engine;
const canvasId = 'game';
const gameFieldMetaData: EngineOptions = {
  height: 600,
  width: 800,
  maxFps: 120,
  canvasElementId: canvasId
}

const copperKey = 'copper_vein';

const init = () => {
  const loadableResources: Loadable<any>[] = [];
  const imageSource = new ImageSource(process.env.REACT_APP_API_ROOT_DOMAIN + '/assets/maps/mining_maps/image_assets/copper_ore_1.png');
  ResourceFetcher.addResources(new Map([[copperKey, imageSource]]));
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
    loadables: [tiledMap, ...(ResourceFetcher.fetchByKeys([copperKey]) || []), ...loadableResources]
  });

  GameEngine = new Engine(gameFieldMetaData);
  GameEngine.toggleDebug();
  const actor = new CopperVein({
    x: 450,
    y: 450,
    color: Color.Chartreuse,
    height: 64,
    width: 64,
    visible: true,
    collisionType: CollisionType.Fixed,
    resourceDetails: new Map()
  });
  
  return GameEngine.start(loader).then(() => {
    actor.graphics.use((ResourceFetcher.fetchByKeys([copperKey])![0] as ImageSource).toSprite());
    GameEngine.add(actor);
    console.log('I am done loading the resources');
    tiledMap.addToScene(GameEngine.currentScene);
    GameEngine.currentScene.actors.forEach((act) => {
      console.log(act);
    });
  });
};

export const gameScript = {
  getGameEngine: () => GameEngine,
  canvasId,
  init,
  gameFieldMetaData
};