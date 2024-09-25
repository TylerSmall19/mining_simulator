import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import { PlayerUserDetailsRepo } from './PlayerUserDetailsRepo';

describe('PlayerUserDetailsRepo', () => {
  let mockFindOne: jest.Mock<Promise<any>>;
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
    mockDb.mockImplementation(() => {
      return ({
        collection: jest.fn(() => ({
          findOne: mockFindOne
        } as unknown as Collection))
      }) as unknown as Db
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