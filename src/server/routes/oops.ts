import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function (f: FastifyInstance) {
  f.get("/oops", (_: FastifyRequest, reply: FastifyReply) => {
    reply.view("/templates/oops.ejs");
  });
}
