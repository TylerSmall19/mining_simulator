import { MongoClient, ServerApiVersion } from 'mongodb';

export class BaseRepository {
  client?: MongoClient;
  dbName: string = 'trackerApp';

  async connectToDB() {
    if (!this.client) {
      this.client = new MongoClient(process.env.MONGO_CONNECTION_STRING || '', {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
    }

    // Connect the client to the server
    await this.client.connect();
  }

  async init(): Promise<void> {
    await this.connectToDB();
  }

  async closeClient() {
    if (this.client)
      await this.client.close();
  }
}