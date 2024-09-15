import { Actor, ActorArgs, Color, Engine, EventTypes, Vector } from "excalibur";
import { APIImageSource } from "../../image_classes/APIImageSource";
import { ResourceFetcher } from "../resources/utils/resourceFetcher";
import { CopperVein } from "../resources/mining/ores/CopperVein";
import { PlayerInventory } from "../../../inventory/PlayerInventory";
import { MineableMineralTypes } from "../resources/mining/types/MineableMineralTypes";
import { PlayerMoveCursor } from "./playerMoveCursor";
import { HarvestableResource } from "../resources/HarvestableResource";

export enum PlayerGenders {
  Male = 'm',
  Female = 'f',
  NonBinary = 'nb'
}

export type PlayerMinerArgs = {
  miningPower?: number;
  gender?: PlayerGenders;
} & ActorArgs

export class PlayerMiner extends Actor {
  gender: PlayerGenders;
  miningAmount: number = 100;
  inventory: PlayerInventory = new PlayerInventory();
  moveCursor?: Actor;

  static readonly textureKey: string = 'player_miner';
  constructor(options: PlayerMinerArgs) {
    super({
      height: 64,
      width: 64,
      ...options
    });

    this.gender = options.gender || PlayerGenders.Male;
    this.body.bounciness = 0;
  }

  onInitialize(engine: Engine<any>): void {
    engine.input.pointers.primary.on("down", (evt) => {
      this.movePlayer(evt.coordinates.worldPos, 150);
    });

    this.on(EventTypes.CollisionStart, (event) => {
      // check for collision with an ore
      const copperActor = event.other as CopperVein
      if (copperActor.name === MineableMineralTypes.Copper) {
        // stop moving
        this.actions.clearActions();
        // kill the cursor
        this.moveCursor?.kill();

        // subtract the mining amount from the ore amount remaining
        copperActor.capacity -= this.miningAmount;

        // add the mined amount to the player inventory
        this.inventory.addItem(MineableMineralTypes.Copper, this.miningAmount);

        if (copperActor.capacity <= 0)
        // if ore is depleted, kill it
          copperActor.kill();
      }
    });

    switch (this.gender) {
      case PlayerGenders.Male:
        const texture = (ResourceFetcher.fetchByKeys([PlayerMiner.textureKey]) || [])[0];
        if (texture)
          this.graphics.use((texture as APIImageSource).toSprite());
        break;
      case PlayerGenders.Female:
        throw new Error('Female not supported yet')
      case PlayerGenders.NonBinary:
        throw new Error('NB not supported yet')
      default:
        break;
    }
  }

  /*
  * returns a promise that resolves when the resource is harvested or depleted
  */
  async harvestResource(resource: HarvestableResource): Promise<void> {
    setInterval(() => {
      // if (resource.)
    }, 500)
  }

  /* 
  * returns a promise that resovles when the character is done moving
  */
  async movePlayer (moveToPosition: Vector, actorSpeed: number): Promise<void> {
    // clear movement actions
    this.actions.clearActions();
    // clear all cursor actors
    // this.scene?.actors.forEach((actor) => {
    //   if(actor.name === cursorActorName)
    //     actor.kill();
    // });
    if (this.moveCursor)
      this.moveCursor.pos = moveToPosition;

    this.moveCursor = this.moveCursor || new PlayerMoveCursor({ pos: moveToPosition });
    this.scene?.add(this.moveCursor);
    return this.actions.moveTo(moveToPosition, actorSpeed).toPromise().then(() => {
      this.moveCursor?.kill();
    });
  }
}