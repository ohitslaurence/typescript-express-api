import { issueToken, signup } from '../auth';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { IUser } from '../../models/user/user.model';

describe('Authentication:', () => {
  test('creates new jwt from user', () => {
    const user: IUser = {
      id: 123,
    } as IUser;
    const token = issueToken(user);
    const verified = jwt.verify(token, config.secrets.jwt) as { id: number };

    expect(verified.id).toBe(user.id);
  });

  test('requires email and password to sign up', async () => {
    expect.assertions(2);

    const req: Request = { body: {} } as Request;
    const res = {
      status(status: number) {
        expect(status).toBe(400);
        return this;
      },
      send(result: { message: string }) {
        expect(typeof result.message).toBe('string');
      },
    } as Response;

    await signup(req, res);
  });
});
