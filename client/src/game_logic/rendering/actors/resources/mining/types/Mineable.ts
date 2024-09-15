import { Actor, ActorArgs } from "excalibur";
import { MineableMineralTypes } from "./MineableMineralTypes";
import { HarvestableResource } from "../../HarvestableResource";

export enum Rarities {
  Common = 'common',
  Rare = 'rare'
}

export const RarityModifiers = {
  [Rarities.Common]: 1,
  [Rarities.Rare]: 1.25
};

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

export class Mineable extends HarvestableResource {
  imageSource: string;
  type: MineableMineralTypes;

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