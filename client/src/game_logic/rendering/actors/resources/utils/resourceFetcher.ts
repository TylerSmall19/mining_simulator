import { Loadable } from "excalibur";
import { MineableMineralTypes } from "../mining/types/MineableMineralTypes";

const resources: ResourceCollection = new Map();
const imgMap: ImagePathMap = {
  ores: {
    [MineableMineralTypes.Copper]: '/assets/maps/mining_maps/image_assets/copper_ore_1.png',
    [MineableMineralTypes.Coal]: '',
    [MineableMineralTypes.Iron]: '',
    [MineableMineralTypes.Lead]: '',
    [MineableMineralTypes.Silver]: '',
    [MineableMineralTypes.Tin]: ''
  },
  characters: {
    player: ''
  }
};
type ImagePathMap = {
  ores: Record<MineableMineralTypes, string>,
  characters: Record<string, string>
};

const fetchByKeys = (keys: (string | symbol)[]): Loadable<any>[] | undefined => {
  const vals: Loadable<any>[] = [];
  keys.forEach(key => {
    const res = resources.get(key);
    if (res)
      vals.push(res);
  });
  return vals;
};

const addResources = (resourcesToAdd: ResourceCollection) => {
  resourcesToAdd.forEach((element, key) => {
    if (resources)
      resources.set(key, element);
  });
};

const getAllResources = (): ResourceCollection => {
  return resources;
};

const fetchItemImagePaths = async (): Promise<ImagePathMap> => {
  return imgMap
}

export type ResourceCollection = Map<string | symbol, Loadable<any>>;

export const ResourceFetcher = {
  fetchByKeys,
  addResources,
  getAllResources,
  fetchItemImagePaths
};