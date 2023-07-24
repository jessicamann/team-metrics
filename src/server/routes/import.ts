import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function (f: FastifyInstance) {
  f.get("/import/jira", (_: FastifyRequest, reply: FastifyReply) => {
    reply.view("/templates/import/jira.ejs", { text: "text" });
  });

  f.post(
    "/import-jira-cards",
    async (request: FastifyRequest, reply: FastifyReply) => {
      f.log.info("importing cards from Jira");
      return reply.code(303).header("location", "/import/jira").send();
    },
  );
}
