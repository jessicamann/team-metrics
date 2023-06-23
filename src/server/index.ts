import path from "path";
import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyAutoload from "@fastify/autoload";

export function buildServer({ logger = true } = {}) {
  const fastify = Fastify({
    logger: logger,
  });

  fastify.register(fastifyView, {
    engine: {
      ejs: require("ejs"),
    },
  });

  fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, "routes"),
    ignorePattern: /.*(test).ts/,
    logLevel: "debug",
  });

  return fastify;
}
