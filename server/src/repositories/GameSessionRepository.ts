import { ObjectId } from "mongodb";
import { BaseRepository } from "./BaseRepository";

export type GameSessionDocument = {
  maxBuyIn: number;
  sessionName: string;
  playersInSession: string[];
  _id?: ObjectId;
  hostId: string;
}

export type CreateGameSessionRequest = {
  maxBuyIn: number;
  sessionName: string;
  hostId: string;
}

export class GameSessionRepository extends BaseRepository {
  collectionName: string = 'gameSessions';

  async createGameSession(session: CreateGameSessionRequest): Promise<GameSessionDocument> {
    try {
      if (session.maxBuyIn === undefined || session.sessionName === undefined)
        throw new Error('Missing required param');

      await this.init();

      if (!this.client)
        throw new Error('No DB client found');

      const myDB = this.client.db(this.dbName);
      const gameSessionCollection = myDB.collection(this.collectionName);

      const doc: GameSessionDocument = {
        maxBuyIn: session.maxBuyIn,
        sessionName: session.sessionName,
        playersInSession: [session.hostId],
        hostId: session.hostId
      };
      const result = await gameSessionCollection.insertOne(doc);

      console.log(
        `A document was inserted with the _id: ${result.insertedId}`,
      );

      if (result.acknowledged)
        return { ...doc, _id: result.insertedId };
      else
        throw new Error('Unable to insert record');
    } finally {
      await this.closeClient();
    }
  }
}