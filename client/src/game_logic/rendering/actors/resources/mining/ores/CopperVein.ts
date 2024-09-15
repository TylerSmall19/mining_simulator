import { CollisionType, Engine } from "excalibur";
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
      collisionType: CollisionType.Fixed,
      visible: true
    });
    this.textureSource = ResourceFetcher.fetchByKeys([CopperVein.key])![0] as APIImageSource;
    }
  override onInitialize(engine: Engine<any>): void {
    const texture = this.textureSource.toSprite();
    this.graphics.use(texture);
  }
}