import merge from 'deepmerge';
import { ServerOptions } from "fastify";

const env = process.env.NODE_ENV;

interface Configuration {
  env?: string;
  server: {
    address: string;
    port: number;
    options: ServerOptions;
  };
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends (object | undefined)
      ? DeepPartial<T[P]>
      : T[P];
};

const developmentConfig: Configuration = {
  env,
  server: {
    address: '127.0.0.1',
    port: 5000,
    options: {
      logger: {
        prettyPrint: {
          translateTime: 'yyyy-mm-dd HH:MM:ss.l',
          ignore: 'pid,hostname',
          levelFirst: true,
        },
      },
    },
  },
};

const productionOverride: DeepPartial<Configuration> = {
  server: {
    options: {
      logger: true,
    },
  },
};

const testOverride: DeepPartial<Configuration> = {
  server: {
    options: {
      logger: false,
    },
  },
};

function makeConfiguration(): Configuration {
  if (env === 'production') {
    return merge(developmentConfig, productionOverride as Partial<Configuration>);
  } else if (env === 'development') {
    return developmentConfig;
  } else if (env === 'test') {
    return merge(developmentConfig, testOverride as Partial<Configuration>);
  } else {
    throw new Error(`Please specify a valid NODE_ENV to start.`);
  }
}

export default makeConfiguration();
