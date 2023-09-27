import formAutoContent from "form-auto-content";
import { saveJsonE } from "@app/common/repository";
import { flowMetricsE } from "@app/import/jira/jira_gateway";
import { buildServer } from "..";
import { Either, EitherAsync, Left } from "purify-ts";
import { ImportError } from "../errors";

jest.mock("@app/common/repository");
jest.mock("@app/import/jira/jira_gateway");

describe("POST /import-jira-cards", () => {
  it("redirects to /data/{id} on successful import", async () => {
    (saveJsonE as jest.Mock).mockReturnValueOnce(Either.of("test-id"));
    (flowMetricsE as jest.Mock).mockReturnValueOnce(
      EitherAsync.liftEither(Either.of([])),
    );

    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "POST",
      url: "/import-jira-cards",
      ...formAutoContent({
        email: "grogu@example.com",
        token: "thisissecret",
        host: "https://groguteam.atlassian.net",
        jql: "project in (b1)",
        startStatus: "in progress",
        finishStatus: "done",
      }),
    });

    expect(response.statusCode).toEqual(303);
    expect(response.headers.location).toEqual("/data/test-id");
  });

  it("returns bad request when request isn't correct", async () => {
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "POST",
      url: "/import-jira-cards",
      ...formAutoContent({
        email: "grogu@example.com",
        token: "thisissecret",
        host: "groguteam.atlassian.net",
        jql: "project in (b1)",
        startStatus: "in progress",
        finishStatus: "done",
      }),
    });

    expect(response.statusCode).toEqual(400);
    expect(JSON.parse(response.body)).toEqual({
      type: "validation-error",
      title: "Request does not match requirements",
      status: 400,
      invalidParams: [
        { name: "$input.host", reason: 'string & Format<"url">' },
      ],
    });
  });

  it("returns error when import fails", async () => {
    (flowMetricsE as jest.Mock).mockReturnValueOnce(
      EitherAsync.liftEither(
        Left(new ImportError("something bad during import")),
      ),
    );

    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "POST",
      url: "/import-jira-cards",
      ...formAutoContent({
        email: "grogu@example.com",
        token: "thisissecret",
        host: "https://groguteam.atlassian.net",
        jql: "project in (b1)",
        startStatus: "in progress",
        finishStatus: "done",
      }),
    });

    expect(JSON.parse(response.body)).toEqual({
      type: "import-fail",
      title: "something bad during import",
      status: 503,
    });
    expect(response.statusCode).toEqual(503);
  });

  it("returns error when something unknown happens", async () => {
    (saveJsonE as jest.Mock).mockImplementationOnce(() => {
      throw new RangeError("random error");
    });

    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "POST",
      url: "/import-jira-cards",
      ...formAutoContent({
        email: "grogu@example.com",
        token: "thisissecret",
        host: "https://groguteam.atlassian.net",
        jql: "project in (b1)",
        startStatus: "in progress",
        finishStatus: "done",
      }),
    });

    expect(response.statusCode).toEqual(500);
    expect(JSON.parse(response.body)).toEqual({
      type: "unknown",
      title: "Something we didn't expect happened",
      status: 500,
    });
  });
});
