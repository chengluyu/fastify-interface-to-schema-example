import { buildServer } from "../src/server";

function tryParseJSON(source: string): any {
  try {
    return JSON.parse(source);
  } catch (e) {
    return null;
  }
}

describe('Server Basic Tests', () => {
  const server = buildServer();

  it('test echo with valid request', async () => {
    const payload = {
      text: 'Hello, world!',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/echo',
      payload,
    });

    expect(response.statusCode).toBe(200);
    expect(tryParseJSON(response.payload)).toEqual(payload);
  });

  it('test echo with bad request', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/echo',
    });

    expect(response.statusCode).toBe(400);
  });
});
