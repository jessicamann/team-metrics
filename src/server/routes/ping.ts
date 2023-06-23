import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function (f: FastifyInstance) {
  f.get("/ping", async (_: FastifyRequest, response: FastifyReply) => {
    response.code(200).send({ ping: "pong" });
  });
}
