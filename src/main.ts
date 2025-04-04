// import 'dotenv/config';
// import { config } from 'dotenv';
// config();
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app/app.module';
// import { ValidationPipe } from '@nestjs/common';
// import * as session from 'express-session';
// import { corsConfig, sessionConfig } from './utils/config';
// import { NestExpressApplication } from '@nestjs/platform-express/interfaces';


// import * as dotenv from 'dotenv';
// dotenv.config();


// const MongoDBStore = require('connect-mongodb-session')(session);

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);
//   app.set('trust proxy', 1); // trust first proxy
//   app.enableCors(corsConfig());
//   app.use(session(sessionConfig(MongoDBStore)));
//   app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
//   await app.listen(process.env.PORT || 4000);
// }
// bootstrap();

import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { corsConfig, sessionConfig } from './utils/config';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as express from 'express';

dotenv.config();

const MongoDBStore = require('connect-mongodb-session')(session);

// Bootstrap function to initialize the NestJS app
async function bootstrap() {
  const server = express(); // Create an Express server instance
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server) // Use Express adapter
  );

  app.set('trust proxy', 1); // Trust proxy for secure headers
  app.enableCors(corsConfig());
  app.use(session(sessionConfig(MongoDBStore)));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.init(); // Initialize NestJS app
  return server; // Return the Express server instance
}

// Export a Vercel-compatible serverless function
module.exports = async (req, res) => {
  const server = await bootstrap(); // Initialize the app for each request
  server(req, res); // Handle the incoming request
};