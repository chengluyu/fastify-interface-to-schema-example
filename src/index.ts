import config from './config';
import { buildServer } from './server';

export async function runServer() {
  const server = buildServer();
  await server.listen(config.server.port, config.server.address);
}

// tslint:disable-next-line:no-console
runServer().catch((e) => console.log(e));
