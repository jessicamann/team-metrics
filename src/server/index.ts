import path from "path";
import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyAutoload from "@fastify/autoload";
import fastifyMultipart from "@fastify/multipart";

const loggerconfig = () => ({
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "HH:MM:ss Z",
      ignore: "pid,hostname",
    },
  },
});

export function buildServer({ logger = true } = {}) {
  const fastify = Fastify({
    logger: logger ? loggerconfig() : false,
  });

  fastify.register(fastifyView, {
    engine: {
      ejs: require("ejs"),
    },
  });

  fastify.register(fastifyMultipart);

  fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, "routes"),
    routeParams: true,
    maxDepth: 3, // default is 2
    ignorePattern: /.*(test).ts/,
    logLevel: "debug",
  });

  fastify.setNotFoundHandler((_, reply) => {
    reply.code(303).header("location", `/oops`).send();
  });

  return fastify;
}
