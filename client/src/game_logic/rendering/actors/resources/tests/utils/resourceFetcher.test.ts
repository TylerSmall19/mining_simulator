import { ImageSource } from "excalibur";
import { APIImageSource } from "../../../../image_classes/APIImageSource";
import { ResourceFetcher } from "../../utils/resourceFetcher";

describe('Resource Fetcher', () => {
  afterEach(() => {
    // cleanup the test collections since they persist
    ResourceFetcher.getAllResources().clear();
  });

  describe('addResources', () => {
    it ('adds the given resources', () => {
      const expectedMap = new Map([
        ['foo', new APIImageSource('foo/bar')],
        ['bar', new APIImageSource('buzz/bazz')]
      ]);
      expect(ResourceFetcher.getAllResources().size).toBe(0);
      ResourceFetcher.addResources(expectedMap);
      expect(ResourceFetcher.getAllResources()).toEqual(expectedMap);
    });

    it('will update an old resource when given the same key', () => {
      const firstMap = new Map([
        ['foo', new APIImageSource('foo/bar')],
        ['bar', new APIImageSource('buzz/bazz')]
      ]);
      const expectedMap = new Map([
        ['foo', new APIImageSource('foo/bar')],
        ['bar', new APIImageSource('buzz/bazz')],
        ['new', new ImageSource('bazz')]
      ]);
      expect(ResourceFetcher.getAllResources().size).toBe(0);
      ResourceFetcher.addResources(firstMap);
      expect(ResourceFetcher.getAllResources()).toEqual(firstMap);
      ResourceFetcher.addResources(expectedMap);
      expect(ResourceFetcher.getAllResources()).toEqual(expectedMap);
    });
  });

  describe('fetchByKeys', () => {
    it('fetches resources for the given keys', () => {
      // ResourceFetcher.fetchOrLoadResource('copper_key')
      const givenMap = new Map([
        ['foo', new APIImageSource('foo/bar')],
        ['bar', new APIImageSource('buzz/bazz')],
        ['new', new ImageSource('bazz')]
      ]);
      const expectedMap = new Map([
        ['foo', givenMap.get('foo')],
        ['new', givenMap.get('new')]
      ]);
      expect(ResourceFetcher.getAllResources().size).toBe(0);
      ResourceFetcher.addResources(givenMap);
      expect(ResourceFetcher.fetchByKeys(['foo', 'new'])?.keys()).toMatchObject(expectedMap.keys());
      expect(ResourceFetcher.fetchByKeys(['foo', 'new'])?.values()).toEqual(expectedMap.values());
    });
  
    xit('will fetch a resource by a given key', () => {
      // ResourceFetcher.fetchOrLoadResource('copper_key')
      const expectedMap = new Map([
        ['foo', new APIImageSource('foo/bar')],
        ['bar', new APIImageSource('buzz/bazz')],
        ['new', new ImageSource('bazz')]
      ]);
      expect(ResourceFetcher.getAllResources().size).toBe(0);
      ResourceFetcher.addResources(expectedMap);
      expect(ResourceFetcher.fetchByKeys(['foo'])).toBe(expectedMap.get('foo'));
      expect(ResourceFetcher.fetchByKeys(['bar'])).toBe(expectedMap.get('bar'));
      expect(ResourceFetcher.fetchByKeys(['new'])).toBe(expectedMap.get('new'));
    });
  })
});