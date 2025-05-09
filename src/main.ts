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

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { corsConfig, sessionConfig } from './utils/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function bootstrap() {
  try {
    const server = express();
    console.log('Initializing Nest app...');
    const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(server),
    );

    app.set('trust proxy', 1);
    app.enableCors(corsConfig());
    app.use(session(sessionConfig()));
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // Set global prefix for API routes, but exclude the root route (/)
    app.setGlobalPrefix('api', {
      exclude: ['/'],
    });

    console.log('App initialized, awaiting init...');
    await app.init();
    console.log('App fully initialized');
    return server;
  } catch (error) {
    console.error('Bootstrap failed:', error);
    throw error;
  }
}

// Type the cachedServer as an Express application
let cachedServer: express.Application | undefined;

module.exports = async (req: express.Request, res: express.Response) => {
  try {
    if (!cachedServer) {
      cachedServer = await bootstrap();
    }
    cachedServer(req, res);
  } catch (error) {
    console.error('Request handling failed:', {
      message: (error as Error).message,
      stack: (error as Error).stack,
      url: req.url,
      method: req.method,
    });
    res.status(500).send('Internal Server Error: ' + (error as Error).message);
  }
};

// Start the server locally for development
if (process.env.NODE_ENV !== 'production') {
  bootstrap()
    .then((server) => {
      const port = process.env.PORT || 3000;
      server.listen(port, () => {
        console.log(`Nest application running locally on port ${port}`);
      });
    })
    .catch((error) => {
      console.error('Error starting local server:', error);
      process.exit(1);
    });
}