import { Request, Response, Handler } from 'express';
import config from '../config';
import { User, IUser } from '../models/user/user.model';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';

export const authentication = (): Handler => {
  const JwtStrategy = Strategy;

  const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secrets.jwt,
  };

  const strategy: Strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
    const user = await User.findById(jwt_payload.id).select('-password').exec();

    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });

  passport.use(strategy);

  return passport.initialize();
};

export const issueToken = (user: IUser): string => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: '100d',
  });
};

export const protect = passport.authenticate('jwt', { session: false });

export const signup: (req: Request, res: Response) => Promise<Response | void> = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'need email and password' });
  }

  try {
    const user = await User.create(req.body);
    const token = issueToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
};

export const signin: (req: Request, res: Response) => Promise<Response | void> = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'need email and password' });
  }

  const invalid = { message: 'Invalid email and password combination' };

  try {
    const user = await User.findOne({ email: req.body.email }).select('email password').exec();

    if (!user) {
      return res.status(401).send(invalid);
    }

    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(401).send(invalid);
    }

    const token: string = issueToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};
