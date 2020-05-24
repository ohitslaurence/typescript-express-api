import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import { authentication } from './utils/auth';

export const initializeExpress = (): Express => {
  const app: Express = express();

  app.use(helmet());
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use(authentication());

  return app;
};
