import fastify from 'fastify';
import config from './config';
import routes from './routes';

export function buildServer() {
  const instance = fastify(config.server.options);
  instance.register(routes);
  return instance;
}
