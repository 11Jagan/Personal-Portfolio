
import { MongoClient, type MongoClientOptions, ServerApiVersion } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'portfolio_jmr'; // Default DB name if not set

// Interface for custom MongoClient options, ensuring serverApi is correctly typed
interface CustomMongoClientOptions extends MongoClientOptions {
  serverApi?: {
    version: string | ServerApiVersion; // Allow string or ServerApiVersion enum
    strict?: boolean;
    deprecationErrors?: boolean;
  };
}

const options: CustomMongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Consider adding these for production readiness:
  // replicaSet: 'yourReplicaSetName', // if using a replica set
  // readPreference: 'primaryPreferred', // or your preferred read preference
  // writeConcern: { w: 'majority' }, // or your preferred write concern
  // connectTimeoutMS: 10000, // 10 seconds
  // socketTimeoutMS: 45000, // 45 seconds
};


let client: MongoClient | null = null; // Initialize client as null
let clientPromise: Promise<MongoClient> | null = null; // Initialize clientPromise as null

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (MONGODB_URI) { // Only attempt to initialize if MONGODB_URI is present
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI, options);
      global._mongoClientPromise = client.connect();
      console.log("MongoDB: New connection initiated for development.");
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(MONGODB_URI, options);
    clientPromise = client.connect();
    console.log("MongoDB: New connection initiated for production.");
  }
} else {
  // Log a warning if MONGODB_URI is not defined. clientPromise remains null.
  console.warn("MongoDB: MONGODB_URI is not defined. MongoDB client will not be initialized. Ensure MONGODB_URI is set in your .env.local or deployment environment.");
}

export { clientPromise, MONGODB_DB_NAME };
