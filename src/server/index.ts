import path from "path";
import Fastify from "fastify";

export function buildServer({ logger = true } = {}) {
  const fastify = Fastify({
    logger: logger,
  });

  fastify.register(require("@fastify/view"), {
    engine: {
      ejs: require("ejs"),
    },
  });

  fastify.register(require("@fastify/autoload"), {
    dir: path.join(__dirname, "routes"),
    ignorePattern: /.*(test).ts/,
    logLevel: "debug",
  });

  return fastify;
}
