import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { JiraRetrieval, flowMetrics } from "@app/import/jira/jira_gateway";
import typia from "typia";
import { saveJson } from "@app/common/repository";

export default async function (f: FastifyInstance) {
  f.get("/import/jira", (_: FastifyRequest, reply: FastifyReply) => {
    reply.view("/templates/import/jira.ejs", { text: "text" });
  });

  f.post(
    "/import-jira-cards",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const importRequest = typia.assert<JiraRetrieval>(request.body);

      const inputData = await flowMetrics(importRequest);
      const id = saveJson(inputData);

      return reply.code(303).header("location", `/data/${id}`).send();
    },
  );
}
