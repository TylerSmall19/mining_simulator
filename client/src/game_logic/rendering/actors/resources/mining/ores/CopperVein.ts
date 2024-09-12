import { CollisionType, Engine } from "excalibur";
import { Mineable, MineableArgs } from "../types/Mineable";
import { APIImageSource } from "../../../../image_classes/APIImageSource";
import { ResourceFetcher } from "../../utils/resourceFetcher";

export type CopperVeinArgs = {  } & MineableArgs

export class CopperVein extends Mineable {
  data: APIImageSource;
  dataHasLoaded: boolean = false;

  constructor(args: CopperVeinArgs) {
    super({
      ...args,
      collisionType: CollisionType.Fixed,
      visible: true
    });
    this.data = ResourceFetcher.fetchByKeys(['copper_vein'])![0] as APIImageSource
    }
    
  override onInitialize(engine: Engine<any>): void {
    const texture = this.data.toSprite();
    this.graphics.use(texture);
  }
}