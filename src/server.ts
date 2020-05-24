import express, { Request, Response, Express } from 'express';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import config from './config';
import cors from 'cors';
import { signup, signin, authentication, protect } from './utils/auth';
import { connect } from './utils/db';

export const app: Express = express();

app.disable('x-powered-by');

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(authentication());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello' });
});

app.post('/', (req: Request, res: Response) => {
  console.log(req.body);
  res.send({ message: 'Ok' });
});

app.post('/signup', signup);
app.post('/signin', signin);

app.get('/secret', protect, (req: Request, res: Response) => {
  console.log(req.user);
  res.json({ message: 'You have reached the protect route!' });
});

export const start = async (): Promise<void> => {
  try {
    await connect();
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/api`);
    });
  } catch (e) {
    console.error(e);
  }
};
