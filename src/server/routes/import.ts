import { z } from "zod";
import { allIssues } from "@app/import/jira/issues";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Version3Client } from "jira.js";
import { JiraRetrieval, flowMetrics } from "@app/import/jira/jira_gateway";
import typia from "typia";

export default async function (f: FastifyInstance) {
  f.get("/import/jira", (_: FastifyRequest, reply: FastifyReply) => {
    reply.view("/templates/import/jira.ejs", { text: "text" });
  });

  f.post(
    "/import-jira-cards",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const importRequest = typia.assert<JiraRetrieval>(request.body);

      const inputData = await flowMetrics(importRequest);

      console.dir(inputData, { depth: null });

      return reply.code(200).send();
    },
  );
}
