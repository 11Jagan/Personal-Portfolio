import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI || !process.env.MONGODB_DB_NAME) {
  throw new Error("Missing MONGODB_URI or MONGODB_DB_NAME in environment variables.");
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb && cachedClient) {
    return cachedDb;
  }

  const client = new MongoClient(uri!);
  await client.connect();
  const db = client.db(dbName!);

  cachedClient = client;
  cachedDb = db;

  return db;
}
