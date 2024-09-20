import { CollisionType, Engine, Scene, Timer } from "excalibur";
import { Mineable, MineableArgs } from "../types/Mineable";
import { APIImageSource } from "../../../../image_classes/APIImageSource";
import { ResourceFetcher } from "../../utils/resourceFetcher";
import { MineableMineralTypes } from "../types/MineableMineralTypes";

export type CopperVeinArgs = {  } & MineableArgs

export class CopperVein extends Mineable {
  resourceType: MineableMineralTypes = MineableMineralTypes.Copper;
  textureSource: APIImageSource;
  static readonly key: MineableMineralTypes = MineableMineralTypes.Copper;

  constructor(args: CopperVeinArgs) {
    super({
      ...args,
      collisionType: CollisionType.Passive,
      visible: true
    });
    this.textureSource = ResourceFetcher.fetchByKeys([CopperVein.key])![0] as APIImageSource;
  }

  override onPostKill(scene: Scene<unknown>): void {
    const respawn = () => {
      this.capacity = 10000;
      scene.add(this);
    };
    const respawnTimer = new Timer({ 
      interval: 6000,
      repeats: false,
      fcn: respawn
    });
    scene.addTimer(respawnTimer);
    respawnTimer.start();
  }

  override onInitialize(engine: Engine<any>): void {
    const texture = this.textureSource.toSprite();
    this.graphics.use(texture);
  }
}