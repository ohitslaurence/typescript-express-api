import { merge } from 'lodash';
const env = process.env.NODE_ENV || 'development';

interface Secrets {
  jwt: string;
  jwtExp: string;
}
export interface IConfiguration {
  env: string;
  isDev: boolean;
  isTest: boolean;
  port: number;
  secrets: Secrets;
  dbUrl: string;
}
const baseConfig: IConfiguration = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  port: 3000,
  secrets: {
    jwt: process.env.JWT_SECRET || '',
    jwtExp: '100d',
  },
  dbUrl: '',
};

let envConfig = {};

switch (env) {
  case 'dev':
  case 'development':
    envConfig = require('./dev').config;
    break;
  case 'test':
  case 'testing':
    envConfig = require('./testing').config;
    break;
  default:
    envConfig = require('./dev').config;
}

export default merge(baseConfig, envConfig) as IConfiguration;
