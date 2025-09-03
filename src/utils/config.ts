// import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
// import { ConfigService } from '@nestjs/config';
// import { MongooseModuleOptions } from '@nestjs/mongoose';
// import { SessionOptions } from 'express-session';

// export const connectDB = (
//   configService: ConfigService
// ): MongooseModuleOptions => {
//   const dbPassword = configService.get<string>('MONGODB_PASSWORD');
//   const dbName = configService.get<string>('MONGODB_DATABASE_NAME');


//   return {
//     uri: mongodbUri,
//     autoIndex: false,
//   };
// };

// export const corsConfig = (): CorsOptions => ({
//   origin: process.env.CLIENT_URL,
//   methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
//   credentials: true,
// });

// export const sessionConfig = (MongoDBStore: any): SessionOptions => ({
//   secret: process.env.SESSION_KEY,
//   resave: false,
//   saveUninitialized: false,
//   cookie:
//     process.env.NODE_ENV === 'production'
//       ? {
//           httpOnly: true,
//           sameSite: 'none',
//           secure: true,
//           maxAge: 3 * 24 * 60 * 60 * 1000,
//         }
//       : { maxAge: 3 * 24 * 60 * 60 * 1000 },
//   store: new MongoDBStore({
//     uri: process.env.MONGODB_URL,
//     collection: 'sessions',
//   }),
// });


// src/utils/config.ts
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { SessionOptions } from 'express-session';
import * as session from 'express-session';

// Import and initialize MongoDBStore
const MongoDBStore = require('connect-mongodb-session')(session);

export const connectDB = (
  configService: ConfigService
): MongooseModuleOptions => {
  // Fetch the MongoDB URI from environment variables via ConfigService
  const mongodbUri = configService.get<string>('MONGODB_URI');

  if (!mongodbUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  return {
    uri: mongodbUri,
    autoIndex: false,
  };
};

export const corsConfig = (): CorsOptions => ({
  origin: process.env.CLIENT_URL,
  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  credentials: true,
});

export const sessionConfig = (): SessionOptions => {
  const store = new MongoDBStore({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/default', // Consistent with connectDB
    collection: 'sessions',
  });

  // Log MongoDB connection errors without crashing
  store.on('error', (error: Error) => {
    console.error('MongoDB session store error:', error);
  });

  return {
    secret: process.env.SESSION_KEY || 'default-secret', // Fallback if SESSION_KEY is missing
    resave: false,
    saveUninitialized: false,
    cookie:
      process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
        ? {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
          }
        : { maxAge: 3 * 24 * 60 * 60 * 1000 }, // 3 days
    store: store,
  };
};