
import { MongoClient, type Db, type MongoClientOptions } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

// Check if MONGODB_URI is defined and valid
if (!MONGODB_URI || MONGODB_URI.trim() === '') {
  console.error('ERROR: MONGODB_URI environment variable is not defined or is empty.');
  throw new Error('Please define a valid MONGODB_URI environment variable inside .env.local or your deployment environment. The current value is missing or empty.');
}

// A more robust check for the URI scheme
try {
  new URL(MONGODB_URI); // This will throw an error for invalid URLs
  if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
    throw new Error('Scheme parsing succeeded but not mongodb/mongodb+srv'); // Should not happen if URL constructor is sound
  }
} catch (e) {
  console.error(`ERROR: MONGODB_URI is not a valid connection string. It must start with "mongodb://" or "mongodb+srv://". Current value (start): "${MONGODB_URI.substring(0,15)}..." Error: ${(e as Error).message}`);
  throw new Error('MONGODB_URI is not a valid connection string. Please check your .env.local file.');
}


if (!MONGODB_DB_NAME || MONGODB_DB_NAME.trim() === '') {
  console.error('ERROR: MONGODB_DB_NAME environment variable is not defined or is empty.');
  throw new Error('Please define the MONGODB_DB_NAME environment variable inside .env.local or your deployment environment. The current value is missing or empty.');
}

interface MongoDBCache {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<Db> | null;
}

// Extend the NodeJS.Global interface to include the mongodb cache
declare global {
  // eslint-disable-next-line no-var
  var mongodb: MongoDBCache | undefined;
}

let cached: MongoDBCache;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global.mongodb) {
    global.mongodb = { client: null, db: null, promise: null };
  }
  cached = global.mongodb;
} else {
  // In production mode, it's best to not use a global variable.
  cached = { client: null, db: null, promise: null };
}

export async function connectToDatabase(): Promise<Db> {
  if (cached.db && cached.client?.topology?.isConnected()) {
    console.log('MongoDB: Using cached database instance');
    return cached.db;
  }

  if (cached.promise) {
    console.log('MongoDB: Awaiting existing connection promise');
    return cached.promise;
  }

  const options: MongoClientOptions = {};

  try {
    console.log('MongoDB: Attempting to connect (URI hidden for security)'); // Log a sanitized URI
    
    const client = new MongoClient(MONGODB_URI, options);
    cached.promise = client.connect().then(connectedClient => {
      cached.client = connectedClient;
      cached.db = connectedClient.db(MONGODB_DB_NAME);
      console.log('MongoDB: Successfully connected to database:', MONGODB_DB_NAME);
      return cached.db;
    }).catch(err => {
      cached.promise = null; // Clear promise on error
      console.error('MongoDB: Connection failed during client.connect() or db initialization:', err);
      throw new Error(`MongoDB connection failed: ${err.message}`);
    });

    return await cached.promise;

  } catch (error: any) {
    cached.promise = null;
    console.error('MongoDB: Outer connection error handler:', error);
    throw new Error(`MongoDB connection setup failed: ${error.message}`);
  }
}
