import { Actor, ActorArgs, Engine, EventTypes, Timer, Vector } from "excalibur";
import { APIImageSource } from "../../image_classes/APIImageSource";
import { ResourceFetcher } from "../resources/utils/resourceFetcher";
import { PlayerInventory } from "../../../inventory/PlayerInventory";
import { Mineable } from "../resources/mining/types/Mineable";
import { PlayerMoveCursor } from "./playerMoveCursor";
import { MessageableActor } from "../shared/MessageableActor";

export enum PlayerGenders {
  Male = 'm',
  Female = 'f',
  NonBinary = 'nb'
}

export type PlayerMinerArgs = {
  miningPower?: number;
  gender?: PlayerGenders;
} & ActorArgs

const miningTimer = 500;

export class PlayerMiner extends MessageableActor {
  gender: PlayerGenders;
  miningAmount: number = 100;
  static inventory: PlayerInventory = new PlayerInventory();
  moveCursor?: Actor;
  engine?: Engine;
  harvestTimer?: Timer;

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
    this.engine = engine;

    engine.input.pointers.primary.on("down", (evt) => {
      this.movePlayer(evt.coordinates.worldPos, 150);
    });

    this.on(EventTypes.CollisionStart, (event) => {
      // check for collision with an ore
      const harvestableActor = event.other as Mineable
      if (!!harvestableActor.harvest) {
        this.mineResource(harvestableActor)
        this.harvestTimer = new Timer({
          interval: miningTimer,
          repeats: true,
          fcn: () => this.mineResource(harvestableActor)
        });
        // throw new Error('TODO: Polish up the mining logic (remove more bugs) and then move the collision logic into the copper ore');
        // stop moving
        this.actions.clearActions();
        if (this.moveCursor?.active)
          // kill the cursor
          this.moveCursor?.kill();
        this.engine?.addTimer(this.harvestTimer);
        // start the timer for mining (using the config)
        this.harvestTimer.start();
      }
    });

    this.on(EventTypes.CollisionEnd, () => {
      if (this.harvestTimer) {
        this.harvestTimer?.cancel();
        this.engine?.removeTimer(this.harvestTimer);
      }
    })

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
  async mineResource(resource: Mineable): Promise<void>  {
    // subtract the mining amount from the ore amount remaining
    const harvestedAmount = resource.harvest(this.miningAmount);
    // add the mined amount to the player inventory
    await PlayerMiner.inventory.addItem(resource.resourceType, harvestedAmount);

    if (resource.isKilled()) {
      this.harvestTimer?.cancel();
    }
  }

  /* 
  * returns a promise that resovles when the character is done moving
  */
  async movePlayer (moveToPosition: Vector, actorSpeed: number): Promise<void> {
    // clear movement actions
    this.actions.clearActions();
    if (this.moveCursor)
      this.moveCursor.pos = moveToPosition;

    this.moveCursor = this.moveCursor || new PlayerMoveCursor({ pos: moveToPosition });
    this.scene?.add(this.moveCursor);
    return this.actions.moveTo(moveToPosition, actorSpeed).toPromise().then(() => {
      this.moveCursor?.kill();
    });
  }
}