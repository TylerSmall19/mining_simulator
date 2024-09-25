import { ObjectId, Db } from "mongodb";
import { BaseRepository } from "./BaseRepository";
import { Logger, logErrorCallback } from "../logger/Logger";

export type PlayerCharacter = {
  characterID: string,
  characterType: 'miner',
  userID: string,
  baseMiningAmount: number,
  characterName: string
}

export type Item = {
  name: string,
  itemLevel: number,
  itemDescription: string
  stats: {
    statName: string,
    affect: number,
    statDescription: string
  }[]
}

/** @param miningInterval: the number of MS that a miner takes to mine new resources */
export type UserDetails = {
  skills: [{
    name: 'mining',
    level: number,
    xp: number
  }],
  characters: {
    _id: ObjectId,
    name: string,
    stats: {
      mining: {
        baseAmount: number,
        miningInterval: number
      }
    }
  }[],
  inventory: Invetory,
  _id: ObjectId
}

export type Invetory = {
  items: Item[]
}

/** 
 * this class will hold things in memory and expose a "persist" method to save things to the DB.
 * 
 * Persist MUST be called or the changes will not make it to the DB and will be lost on the websocket connection
 * 
 * This will persist the user data in memory during playtime when the websocket connection is active, and should
 * persist when the socket closes. (This logic must be written someone else, this will NOT persist the data on the calls)
 */
export class PlayerUserDetailsRepo extends BaseRepository {
  // collectionName: string = 'playerCharacters';
  collectionName: string = 'playerGameDetails';
  inventory: Invetory | null = null;
  playerDetailsDB: Db | null = null;
  user: UserDetails | null = null;

  async init(): Promise<void> {
    await super.init()
    .then(() => {
      if (this.client)
        this.playerDetailsDB = this.client.db(this.dbName);
    })
    .catch((ex) => {
      Logger.error('There was an issue setting up the connection:', ex);
    })
  }

  async getCharacterByID(id: string): Promise<PlayerCharacter> {
    if (!this.playerDetailsDB)
      await this.init();

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

  async getPlayerInventory(userId: string): Promise<Invetory> {
    if (!this.inventory) {
      if (!this.user) {
        const user = await this.getPlayerbyID(userId);
        if (user && user.inventory) {
          this.inventory = user.inventory
          return this.inventory;
        } else {
          const errorMsg = `Cannot find user ${userId}`
          Logger.error(errorMsg);
          throw new Error(errorMsg);
        }
      } else {
        this.inventory = this.user.inventory;
        return this.user.inventory;
      }
    }

    return this.inventory;
  }

  /** player added ID: 66f2d5a999c8ab8eeea59c0e */
  async getPlayerbyID(userId: string): Promise<UserDetails> {
    Logger.info('Fetching the player details for:', userId)
    if (this.user)
      return this.user;

    const errorMsg = `Error finding record with ID: ${userId}`;
    if (!this.playerDetailsDB) {
      Logger.info('Calling init for the DB, userID:', userId);
      await this.init()
    }

    const user = await this.playerDetailsDB
      ?.collection<UserDetails>(this.collectionName)
      .findOne({ _id: new ObjectId(userId) })
      .catch(logErrorCallback(errorMsg));

    if (user) {
      this.user = user;
      return user;
    }
    else
      throw new Error(errorMsg);
  }

  async addCharacterToUser(character: PlayerCharacter, userId: string): Promise<boolean> {
    Logger.info(userId, character);
    throw new Error('Not implemented');
  }

  async addPlayerSkillXP(): Promise<boolean> {
    throw new Error('Not implemented');
  }

  async addItemToPlayer(): Promise<boolean> {
    throw new Error('Not implemented');
  }

  async addResource(): Promise<boolean> {
    throw new Error('Not implemented');
  }

  async persistToDB(): Promise<boolean> {
    throw new Error('Not implemented');
  }
}