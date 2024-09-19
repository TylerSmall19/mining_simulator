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
      const givenMap = new Map([
        ['foo', new APIImageSource('foo/bar')],
        ['bar', new APIImageSource('buzz/bazz')],
        ['new', new ImageSource('bazz')]
      ]);
      const expectedRes = [
        givenMap.get('foo'),
        givenMap.get('new')
      ];
      expect(ResourceFetcher.getAllResources().size).toBe(0);
      ResourceFetcher.addResources(givenMap);
      expect(ResourceFetcher.fetchByKeys(['foo', 'new'])).toEqual(expectedRes);
    });
  
    it('will leave out keys not found', () => {
      const givenMap = new Map([
        ['foo', new APIImageSource('foo/bar')],
        ['bar', new APIImageSource('buzz/bazz')],
        ['new', new ImageSource('bazz')]
      ]);
      const expectedRes = [
        givenMap.get('foo'),
        givenMap.get('new')
      ];
      expect(ResourceFetcher.getAllResources().size).toBe(0);
      ResourceFetcher.addResources(givenMap);
      expect(ResourceFetcher.fetchByKeys(['foo', 'new', 'blewey'])).toEqual(expectedRes);
    });
  })
});