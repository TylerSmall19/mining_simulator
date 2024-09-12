import { Loadable } from "excalibur";

const resources: ResourceCollection = new Map();

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

export type ResourceCollection = Map<string | symbol, Loadable<any>>;

export const ResourceFetcher = {
  fetchByKeys,
  addResources,
  getAllResources
};