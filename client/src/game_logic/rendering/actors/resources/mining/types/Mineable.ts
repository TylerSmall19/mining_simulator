import { Actor, ActorArgs } from "excalibur";

export enum MineableMineralTypes {
  Copper = "copper",
  Tin = "tin",
  Silver = 'silver',
  Iron = 'iron',
  Lead = 'lead',
  Coal = 'coal'
}

export enum Rarities {
  Common = 'common',
  Rare = 'rare'
}

export type MineableDetails = {
  capacity: string;
  rarity: Rarities;
  name: string;
  type: MineableMineralTypes;
  image_path: string;
}

export type MineableArgs = {
  resourceDetails: Map<string, any>
} & ActorArgs

export class Mineable extends Actor {
  capacity: number;
  rarity: Rarities;
  name: string;
  type: MineableMineralTypes;
  imageSource: string;

  constructor(args: MineableArgs) {
    super(args);
    const details = args.resourceDetails;
    this.capacity = parseFloat(details.get('capacity')) || 0;
    this.rarity = details.get('rarity') as Rarities;
    this.name = details.get('name');
    this.type = details.get('type') as MineableMineralTypes;
    this.imageSource = details.get('image_path');
  }
};