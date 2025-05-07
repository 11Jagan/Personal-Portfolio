
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


let client: MongoClient | null = null; 
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!MONGODB_URI || MONGODB_URI === "YOUR_MONGODB_CONNECTION_STRING") {
  console.error("CRITICAL_MONGODB_CONFIG: MONGODB_URI is not defined or is set to the placeholder value. Please define a valid MONGODB_URI in your .env.local file or deployment environment. The contact form will not work without it.");
  // clientPromise remains null, which will be handled by the API route.
} else if (!MONGODB_URI.startsWith("mongodb://") && !MONGODB_URI.startsWith("mongodb+srv://")) {
  console.error(`CRITICAL_MONGODB_CONFIG: Invalid MONGODB_URI scheme. Expected connection string to start with "mongodb://" or "mongodb+srv://". Received: "${MONGODB_URI.substring(0,20)}..." The contact form will not work.`);
  // clientPromise remains null
} else {
  try {
    if (process.env.NODE_ENV === 'development') {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      if (!global._mongoClientPromise) {
        client = new MongoClient(MONGODB_URI, options);
        global._mongoClientPromise = client.connect();
        console.info("MongoDB: New connection initiated for development.");
      }
      clientPromise = global._mongoClientPromise;
    } else {
      // In production mode, it's best to not use a global variable.
      client = new MongoClient(MONGODB_URI, options);
      clientPromise = client.connect();
      console.info("MongoDB: New connection initiated for production.");
    }
  } catch (error: any) {
    console.error(`CRITICAL_MONGODB_SETUP_FAILED: Failed to initialize MongoClient. Error: ${error.message}. Check your MONGODB_URI and network settings.`);
    clientPromise = null; // Ensure clientPromise is null on setup failure.
  }
}

export { clientPromise, MONGODB_DB_NAME };
