import { z } from "zod";
import { allIssues } from "@app/import/jira/issues";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Version3Client } from "jira.js";
import { MinimumIssue, inputDataFrom } from "@app/import/jira/jira_gateway";
import typia from "typia";
import { Just, List, Maybe, Nothing } from "purify-ts";
import { InputData } from "@app/common/repository";

const importRequestSchema = z.object({
  email: z.string(),
  apiKey: z.string(),
  host: z.string(),
  jql: z.string(),
  startStatus: z.string(),
});

export default async function (f: FastifyInstance) {
  f.get("/import/jira", (_: FastifyRequest, reply: FastifyReply) => {
    reply.view("/templates/import/jira.ejs", { text: "text" });
  });

  f.post(
    "/import-jira-cards",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const importRequest = importRequestSchema.parse(request.body);

      const issues = await allIssues(
        new Version3Client({
          host: importRequest.host,
          authentication: {
            basic: {
              email: importRequest.email,
              apiToken: importRequest.apiKey,
            },
          },
        }),
        importRequest.jql,
        { maxResults: 150 },
      );

      const inputData = issues
        .map((issue) => Maybe.encase(() => typia.assert<MinimumIssue>(issue)))
        .reduce((acc, potentialIssue) => {
          return potentialIssue.caseOf({
            Just: (issue) => [...acc, inputDataFrom(issue)],
            Nothing: () => acc,
          });
        }, new Array<Maybe<InputData>>());

      console.dir(Maybe.catMaybes(inputData), { depth: null });

      return reply.code(200).send();
    },
  );
}
