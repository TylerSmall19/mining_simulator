import { MongoClient } from "mongodb";
import { CreateGameSessionRequest, GameSessionRepository } from "../repositories/GameSessionRepository";

describe.skip('GameSessionRepository', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('Has a createGameSession method', () => {
    const repoToTest = new GameSessionRepository();
    jest.spyOn(repoToTest, 'init').mockResolvedValue();

    const mockClient = { close: () => {}, db: () => ({ collection: () => ({ insertOne: jest.fn(async () => ({ insertedId: 'foo' })) }) }) };
    repoToTest.client = mockClient as unknown as MongoClient;

    expect(repoToTest.createGameSession).toBeDefined();
  });

  describe('createGameSession', () => {
    it('Will throw an error if a validation is not met', async () => {
      const repoToTest = new GameSessionRepository();
      jest.spyOn(repoToTest, 'init').mockResolvedValue();

      const mockClient = { close: () => {}, db: () => ({ collection: () => ({ insertOne: jest.fn(async () => ({ insertedId: 'foo' })) }) }) };
      repoToTest.client = mockClient as unknown as MongoClient;

      await expect(() => repoToTest.createGameSession({} as CreateGameSessionRequest)).rejects.toThrow('Missing required param');
    });

    it('Calls insertOne with the given params', async () => {
      const repoToTest = new GameSessionRepository();
      jest.spyOn(repoToTest, 'init').mockResolvedValue();
      const mockInsert = jest.fn(async () => ({ insertedId: 'foo', acknowledged: true }));
      const mockClient = { close: () => {}, db: () => ({ collection: () => ({ insertOne: mockInsert }) }) };
      repoToTest.client = mockClient as unknown as MongoClient;

      await repoToTest.createGameSession({ hostId: 'foo-host', maxBuyIn: 35.5, sessionName: 'test-session'} as CreateGameSessionRequest)
      const expectedDoc = {
        playersInSession: ['foo-host'],
        maxBuyIn: 35.5,
        sessionName: 'test-session',
        hostId: 'foo-host'
      }

      expect(mockInsert).toHaveBeenCalledWith(expectedDoc);
    });

    it('Throws an error when the inserted record is not acknowledged', async () => {
      const repoToTest = new GameSessionRepository();
      jest.spyOn(repoToTest, 'init').mockResolvedValue();
      const mockInsert = jest.fn(async () => ({ insertedId: undefined, acknowledged: false }));
      const mockClient = { close: () => {}, db: () => ({ collection: () => ({ insertOne: mockInsert }) }) };
      repoToTest.client = mockClient as unknown as MongoClient;

      await expect(() => repoToTest.createGameSession({ hostId: 'foo-host', maxBuyIn: 35.5, sessionName: 'test-session'} as CreateGameSessionRequest))
      .rejects.toThrow('Unable to insert record');
    });

    it('Returns the whole record when the inserted record is acknowledged from the DB', async () => {
      const repoToTest = new GameSessionRepository();
      jest.spyOn(repoToTest, 'init').mockResolvedValue();
      const mockInsert = jest.fn(async () => ({ insertedId: 'foo', acknowledged: true }));
      const mockClient = { close: () => {}, db: () => ({ collection: () => ({ insertOne: mockInsert }) }) };
      repoToTest.client = mockClient as unknown as MongoClient;

      const result = await repoToTest.createGameSession({ hostId: 'foo-host', maxBuyIn: 35.5, sessionName: 'test-session'} as CreateGameSessionRequest)

      const expectedDoc = {
        playersInSession: ['foo-host'],
        maxBuyIn: 35.5,
        sessionName: 'test-session',
        _id: 'foo',
        hostId: 'foo-host'
      }

      expect(result).toEqual(expectedDoc);
    });

    it('Has the correct db name and collection name', async () => {
      const repoToTest = new GameSessionRepository();
      jest.spyOn(repoToTest, 'init').mockResolvedValue();
      const mockInsert = jest.fn(async () => ({ insertedId: 'foo' }));
      const mockClient = { close: () => {}, db: () => ({ collection: () => ({ insertOne: mockInsert }) }) };
      repoToTest.client = mockClient as unknown as MongoClient;

      expect(repoToTest.dbName).toBe('trackerApp');
      expect(repoToTest.collectionName).toBe('gameSessions');
    });

    it('Throws an error if there is no client', async () => {
      const repoToTest = new GameSessionRepository();
      jest.spyOn(repoToTest, 'init').mockResolvedValue();
      const mockInsert = jest.fn(async () => ({ insertedId: 'foo' }));
      // @ts-ignore
      repoToTest.client = null

      await expect(() => repoToTest.createGameSession({ hostId: 'foo-host', maxBuyIn: 35.5, sessionName: 'test-session'} as CreateGameSessionRequest))
      .rejects.toThrow('No DB client found');
    });
  });
});