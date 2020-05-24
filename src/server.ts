import { Request, Response, Express } from 'express';
import config from './config';
import { signup, signin, protect } from './utils/auth';
import { connect } from './utils/db';
import { initializeExpress } from './express';

const app: Express = initializeExpress();

app.get('/', (_req: Request, res: Response) => {
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
