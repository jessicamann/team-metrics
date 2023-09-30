import path from "path";
import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyAutoload from "@fastify/autoload";
import fastifyMultipart from "@fastify/multipart";
import fastifyFormbody from "@fastify/formbody";
import fastifyStatic from "@fastify/static";

export function buildServer({ logger = true } = {}) {
  const fastify = Fastify({
    logger: logger,
  });

  fastify.register(fastifyView, {
    engine: {
      ejs: require("ejs"),
    },
  });

  fastify.register(fastifyMultipart);
  fastify.register(fastifyFormbody);
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "../../public"),
    prefix: "/public",
    prefixAvoidTrailingSlash: true,
  });

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

  fastify.setErrorHandler((e, _req, reply) => {
    fastify.log.error(_req);
    fastify.log.error(e);
    reply.code(500).send({
      error: "internal server error; we'll take a look on our end.",
    });
  });

  return fastify;
}
