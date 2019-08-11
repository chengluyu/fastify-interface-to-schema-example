import { DefaultBody, DefaultHeaders, DefaultParams, DefaultQuery, FastifyError, FastifyInstance } from 'fastify';
import { getRouteOptionsFor } from '../schema';

interface EchoBody extends DefaultBody {
  text: string;
}

interface EchoResponse {
  text: string;
}

export default function routes<T>(
  instance: FastifyInstance,
  options: T,
  done: (err?: FastifyError) => void,
) {
  instance.post<DefaultQuery, DefaultParams, DefaultHeaders, EchoBody>(
    '/echo',
    getRouteOptionsFor('Echo'),
    async (request, reply) => {
      reply.send({ text: request.body.text });
    },
  );

  done();
}
