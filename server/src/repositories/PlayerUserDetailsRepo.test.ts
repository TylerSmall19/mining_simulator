import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import { PlayerUserDetailsRepo } from './PlayerUserDetailsRepo';

describe('PlayerUserDetailsRepo', () => {
  let mockFindOne: jest.Mock<Promise<any>>;
  let mockInsertOne: jest.Mock<Promise<any>>;
  let mockClient: MongoClient;
  let mockDb: jest.SpyInstance<Db>;

  afterEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    await mockClient.close();
  });

  beforeEach(() => {
    // @ts-ignore
    mockClient = new MongoClient(globalThis.__MONGO_URI__);
    mockDb = jest.spyOn(mockClient, 'db');
    mockFindOne = jest.fn(async () => {});
    mockInsertOne = jest.fn(async () => {});
    mockDb.mockImplementation(() => {
      return ({
        collection: jest.fn(() => ({
          findOne: mockFindOne,
          insertOne: mockInsertOne
        } as unknown as Collection))
      }) as unknown as Db
    });
  });

  describe('createNewPlayer', () => {
    it('adds a player to the DB when given a name', async () => {
      expect.assertions(2);
      expect(mockInsertOne).toHaveBeenCalledTimes(0);
      const repoToTest = new PlayerUserDetailsRepo(mockClient);
      await repoToTest.createNewPlayer({ playerName: 'test-foo' });
      expect(mockInsertOne).toHaveBeenCalledTimes(1);
    });

    it('returns a player with a matching playerName to that given', async () => {
      expect.assertions(2);
      expect(mockInsertOne).toHaveBeenCalledTimes(0);
      mockInsertOne.mockImplementation(async (item) => {
        return { insertedId: item._id }
      });
      const repoToTest = new PlayerUserDetailsRepo(mockClient);
      const actual = await repoToTest.createNewPlayer({ playerName: 'test-foo' });
      expect(actual?.playerName).toBe('test-foo');
    });

    it('sets User to the inserted player', async () => {
      expect.assertions(3);
      expect(mockInsertOne).toHaveBeenCalledTimes(0);
      mockInsertOne.mockImplementation(async (item) => {
        return { insertedId: item._id }
      });
      const repoToTest = new PlayerUserDetailsRepo(mockClient);
      expect(repoToTest.user?.playerName).not.toBe('test-foo');
      await repoToTest.createNewPlayer({ playerName: 'test-foo' });
      expect(repoToTest.user?.playerName).toBe('test-foo');
    });

    it('returns a player with an empty skills array', async () => {
      expect.assertions(2);
      expect(mockInsertOne).toHaveBeenCalledTimes(0);
      mockInsertOne.mockImplementation(async (item) => {
        return { insertedId: item._id }
      });
      const repoToTest = new PlayerUserDetailsRepo(mockClient);
      const actual = await repoToTest.createNewPlayer({ playerName: 'test-foo' });
      expect(actual?.skills).toEqual([]);
    });

    it('returns a player with an empty items array', async () => {
      expect.assertions(2);
      expect(mockInsertOne).toHaveBeenCalledTimes(0);
      mockInsertOne.mockImplementation(async (item) => {
        return { insertedId: item._id }
      });
      const repoToTest = new PlayerUserDetailsRepo(mockClient);
      const actual = await repoToTest.createNewPlayer({ playerName: 'test-foo' });
      expect(actual?.inventory.items).toEqual([]);
    });

    it('returns a player with an inventory object without items', async () => {
      expect.assertions(2);
      expect(mockInsertOne).toHaveBeenCalledTimes(0);
      mockInsertOne.mockImplementation(async (item) => {
        return { insertedId: item._id }
      });
      const repoToTest = new PlayerUserDetailsRepo(mockClient);
      const actual = await repoToTest.createNewPlayer({ playerName: 'test-foo' });
      expect(actual?.inventory).toEqual({items: []});
    });

    it('returns a player with no characters', async () => {
      expect.assertions(2);
      expect(mockInsertOne).toHaveBeenCalledTimes(0);
      mockInsertOne.mockImplementation(async (item) => {
        return { insertedId: item._id }
      });
      const repoToTest = new PlayerUserDetailsRepo(mockClient);
      const actual = await repoToTest.createNewPlayer({ playerName: 'test-foo' });
      expect(actual?.characters).toEqual([]);
    });

    it('throws when a duplicate playerName is given', async () => {
      expect.assertions(2);
      expect(mockInsertOne).toHaveBeenCalledTimes(0);
      mockInsertOne.mockImplementation(async (item) => {
        return { insertedId: item._id }
      });
      mockFindOne.mockImplementation(async () => {
        return { _id: 'foo', playerName: 'test-foo' }
      });
      const repoToTest = new PlayerUserDetailsRepo(mockClient);
      await expect(repoToTest.createNewPlayer({ playerName: 'test-foo' })).rejects.toThrow('Duplicate');
    });

    it('returns undefined when a duplicate player cannot be created', async () => {
      expect.assertions(2);
      expect(mockInsertOne).toHaveBeenCalledTimes(0);
      mockInsertOne.mockImplementation(async () => {
        return { insertedId: null }
      });
      const repoToTest = new PlayerUserDetailsRepo(mockClient);
      const actual = await repoToTest.createNewPlayer({ playerName: 'test-foo' });
      expect(actual).toBe(undefined);
    });
  });

  describe('getPlayerbyID', () => {
    it('Returns a player when one is found in findOne with an ID', async () => {
      expect.assertions(1);
      const mockID = new ObjectId().toHexString();
      const expectedUser = { _id: mockID };
      mockFindOne.mockImplementation(async () => (expectedUser))

      const repoToTest = new PlayerUserDetailsRepo(mockClient);
      expect(await repoToTest.getPlayerbyID(mockID)).toBe(expectedUser);
    });

    it('Sets the player in memory when one is found', async () => {
      expect.assertions(1);
      const mockID = new ObjectId().toHexString();
      const expectedUser = { _id: mockID };
      mockFindOne.mockImplementation(async () => (expectedUser));

      const repoToTest = new PlayerUserDetailsRepo(mockClient);
      await repoToTest.getPlayerbyID(mockID);
      expect(repoToTest.user).toBe(expectedUser);
    });

    it('Doesnt call the DB again after the user has been retrieved once', async () => {
      expect.assertions(4);
      expect(mockFindOne).toHaveBeenCalledTimes(0);
      const mockID = new ObjectId().toHexString();
      const expectedUser = { _id: mockID };
      mockFindOne.mockImplementation(async () => (expectedUser));

      const repoToTest = new PlayerUserDetailsRepo(mockClient);
      await repoToTest.getPlayerbyID(mockID);
      expect(repoToTest.user).toBe(expectedUser);
      expect(mockFindOne).toHaveBeenCalledTimes(1);
      await repoToTest.getPlayerbyID(mockID);
      await repoToTest.getPlayerbyID(mockID);
      expect(mockFindOne).toHaveBeenCalledTimes(1);
    });

    it('throws an error when a user is not found', async () => {
      expect.assertions(1);
      const mockID = new ObjectId().toHexString();
      const repoToTest = new PlayerUserDetailsRepo(mockClient);
      await expect(repoToTest.getPlayerbyID(mockID)).rejects.toThrow('Error finding');
    });

    it('handles an error when findOne throws', async () => {
      expect.assertions(1);
      const mockID = new ObjectId().toHexString();
      mockFindOne.mockImplementation(async () => { throw new Error('forced error') });
      const repoToTest = new PlayerUserDetailsRepo(mockClient);
      await expect(repoToTest.getPlayerbyID(mockID)).rejects.not.toThrow('forced error');
    });

    it('calls init when the DB is not yet connected', async () => {
      expect.assertions(2);
      const mockID = new ObjectId().toHexString();
      mockFindOne.mockImplementation(async () => { return { _id: '' } });
      const repoToTest = new PlayerUserDetailsRepo(mockClient);
      const mockInit = jest.spyOn(repoToTest, 'init');
      expect(mockInit).not.toHaveBeenCalled();
      await repoToTest.getPlayerbyID(mockID);
      expect(mockInit).toHaveBeenCalledTimes(1);
    });
  });
});