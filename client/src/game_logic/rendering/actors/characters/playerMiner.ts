import { Actor, ActorArgs } from "excalibur";

export type PlayerMinerArgs = {
  miningPower?: number;
  gender?: 'm' | 'f' | 'nb';
} & ActorArgs

export class PlayerMiner extends Actor {
  gender: 'm' | 'f' | 'nb';
  /**
   *
   */
  constructor(options: PlayerMinerArgs) {
    super(options);
    this.gender = options.gender || 'm';
  }
}