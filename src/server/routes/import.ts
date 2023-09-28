import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { JiraRetrieval, flowMetricsE } from "@app/import/jira/jira_gateway";
import typia, { TypeGuardError } from "typia";
import { saveJsonE } from "@app/common/repository";
import { Either, EitherAsync } from "purify-ts";
import {
  ImportError,
  ProblemResponse,
  ValidationProblemResponse,
} from "../errors";

export default async function (f: FastifyInstance) {
  f.get("/import/jira", (_: FastifyRequest, reply: FastifyReply) => {
    reply.view("/templates/import/jira.ejs", {
      text: "text",
      data: {
        host: "",
        email: "",
        token: "",
        jql: "",
        startStatus: "",
        finishStatus: "",
      },
      errors: [],
    });
  });

  f.post("/import/jira", (request: FastifyRequest, reply: FastifyReply) => {
    return validateImportRequest(request)
      .map(toSaneRequest)
      .chain(importFromJira)
      .mapLeft(toProblemResponse)
      .caseOf({
        Left: (e) =>
          reply.view("/templates/import/jira.ejs", {
            errors: [{ message: e.title }],
            data: request.body,
          }),
        Right: (id) => reply.code(303).header("location", `/data/${id}`).send(),
      });
  });
}

function validateImportRequest(
  request: FastifyRequest,
): EitherAsync<TypeGuardError, JiraRetrieval> {
  return EitherAsync.liftEither(
    Either.encase<TypeGuardError, JiraRetrieval>(() =>
      typia.assert<JiraRetrieval>(request.body),
    ),
  );
}

function toProblemResponse<T extends Error>(e: T): ProblemResponse {
  if (e instanceof TypeGuardError) {
    return toValidationErrorResponse(e);
  } else if (e instanceof ImportError) {
    return {
      type: e.name,
      title: e.message,
      status: 503,
    };
  } else {
    return {
      type: "unknown",
      title: "Something we didn't expect happened",
      status: 500,
    };
  }
}

function toValidationErrorResponse(
  e: TypeGuardError,
): ValidationProblemResponse {
  return {
    type: "validation-error",
    title: "Request does not match requirements",
    status: 400,
    invalidParams: [{ name: e.path || "", reason: e.expected }],
  };
}

function importFromJira(
  importRequest: JiraRetrieval,
): EitherAsync<Error, string> {
  return flowMetricsE(importRequest).chain((inputData) =>
    EitherAsync.liftEither(saveJsonE(inputData)),
  );
}

function toSaneRequest(importRequest: JiraRetrieval): JiraRetrieval {
  return {
    ...importRequest,
    startStatus: importRequest.startStatus.toLowerCase().trim(),
    finishStatus: importRequest.finishStatus.toLowerCase().trim(),
  };
}
