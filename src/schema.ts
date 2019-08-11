import { JSONSchema, RouteSchema, RouteShorthandOptions } from 'fastify';
import * as tjs from 'typescript-json-schema';

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

function retriveSchema(symbolName: string): tjs.Definition | undefined {
  return allSymbols.has(symbolName)
    ? defaultGenerator.getSchemaForSymbol(symbolName)
    : undefined;
}

export function getRouteOptionsFor(name: string): RouteShorthandOptions {
  return { schema: getSchemaFor(name) };
}

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
