import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function (f: FastifyInstance) {
  f.get("/", (_: FastifyRequest, reply: FastifyReply) => {
    reply.view("/templates/index.ejs", { text: "text" });
  });
}
