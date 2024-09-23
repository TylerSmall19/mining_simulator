import { ObjectId } from "mongodb";
import { BaseRepository } from "./BaseRepository";

export type PlayerCharacter = {
  characterID: string,
  characterType: 'miner',
  userID: string,
  baseMiningAmount: number,
  characterName: string
}

// DB ID: 66f18ba57587aa3fc91b7c15
export class PlayerCharacterRepo extends BaseRepository {
  collectionName: string = 'playerCharacters';

  async getCharacterByID(id: string): Promise<PlayerCharacter> {
    if (!this.client)
      throw new Error('No DB client found');

    const myDB = this.client.db(this.dbName);
    const gameSessionCollection = myDB.collection<PlayerCharacter>(this.collectionName);

    const result = await gameSessionCollection.findOne({
      _id: new ObjectId(id)
    });

    if (result)
      return result;
    else
      throw new Error(`No character found with this ID: ${id}`);
  }
}