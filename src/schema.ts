import { JSONSchema, RouteSchema, RouteShorthandOptions } from 'fastify';
import * as tjs from 'typescript-json-schema';

/**
 * Build a schema generator from current project.
 * Raise an error if failed to build.
 */
function buildSchemaGenerator(): tjs.JsonSchemaGenerator {
  const settings: tjs.PartialArgs = { required: true };
  const program = tjs.programFromConfig('./tsconfig.json');
  const generator = tjs.buildGenerator(program, settings);
  if (generator === null) {
    throw new Error('cannot build the generator');
  }
  return generator;
}

const defaultGenerator = buildSchemaGenerator();
const allSymbols = new Set(defaultGenerator.getUserSymbols());

/**
 * Retrieve generated JSON schema from the interface name.
 * If the symbol does not exists, return `undefined`.
 * @param symbolName name of the symbol
 */
function retriveSchema(symbolName: string): tjs.Definition | undefined {
  return allSymbols.has(symbolName)
    ? defaultGenerator.getSchemaForSymbol(symbolName)
    : undefined;
}

/**
 * Shorthand function if you need only schema in route options.
 * @param name name of the route
 */
export function getRouteOptionsFor(name: string): RouteShorthandOptions {
  return { schema: getSchemaFor(name) };
}

/**
 * Try to retrieve corresponding interface for query, params, body and
 * response by name prefix, and assemble them into a schema object.
 * @param name name of the route
 */
export function getSchemaFor(name: string): RouteSchema {
  const response: { [code: number]: JSONSchema, [code: string]: JSONSchema } = {};
  const schemaForOK = retriveSchema(`${name}Response`);
  if (schemaForOK !== undefined) {
    response[200] = schemaForOK;
  }
  return {
    querystring: retriveSchema(`${name}Query`),
    params: retriveSchema(`${name}Params`),
    body: retriveSchema(`${name}Body`),
    response,
  };
}
