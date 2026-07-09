import mongoose from 'mongoose';

let mongoMemoryServer: any = null;

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (mongoURI) {
      console.log('Connecting to database via provided MONGODB_URI...');
      await mongoose.connect(mongoURI);
      console.log('MongoDB connected successfully.');
    } else {
      console.log('No MONGODB_URI found in environment variables. Starting In-Memory MongoDB Server...');
      
      // Dynamic import to keep runtime fast and prevent bundler errors
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const inMemoryURI = mongoMemoryServer.getUri();
      
      console.log(`In-Memory MongoDB Server started at URI: ${inMemoryURI}`);
      await mongoose.connect(inMemoryURI);
      console.log('Connected to In-Memory MongoDB.');
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
};

export const closeDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
      console.log('In-Memory MongoDB Server stopped.');
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};
