import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function (f: FastifyInstance) {
  f.get("/ping", async (_: FastifyRequest, reply: FastifyReply) => {
    reply.code(200).send({ ping: "pong" });
  });
}
