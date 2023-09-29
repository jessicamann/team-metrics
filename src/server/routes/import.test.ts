import formAutoContent from "form-auto-content";
import { parse } from "node-html-parser";
import { saveJsonE } from "@app/common/repository";
import { flowMetricsE } from "@app/import/jira/jira_gateway";
import { buildServer } from "..";
import { Either, EitherAsync, Left } from "purify-ts";
import { ImportError } from "../errors";

jest.mock("@app/common/repository");
jest.mock("@app/import/jira/jira_gateway");

describe("POST /import/jira", () => {
  it("redirects to /data/{id} on successful import", async () => {
    (saveJsonE as jest.Mock).mockReturnValueOnce(Either.of("test-id"));
    (flowMetricsE as jest.Mock).mockReturnValueOnce(
      EitherAsync.liftEither(Either.of([])),
    );

    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "POST",
      url: "/import/jira",
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

  it("shows validation errors and returns bad request when validation fails", async () => {
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "POST",
      url: "/import/jira",
      ...formAutoContent({
        email: "grogu@example.com",
        token: "thisissecret",
        host: "groguteam.atlassian.net",
        jql: "project in (b1)",
        startStatus: "in progress",
        finishStatus: "done",
      }),
    });

    const errors = parse(response.body)
      .querySelectorAll(".notification")
      .flatMap((e) => e.getElementsByTagName("li"))
      .map((e) => e.textContent);

    expect(errors).toEqual(
      expect.arrayContaining([
        "Request does not match requirements",
        '$input.host: string & Format<"url">',
      ]),
    );
    expect(response.statusCode).toEqual(400);
  });

  it("shows import errors and returns bad gateway when integration fails", async () => {
    (flowMetricsE as jest.Mock).mockReturnValueOnce(
      EitherAsync.liftEither(
        Left(new ImportError("something bad during import")),
      ),
    );

    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "POST",
      url: "/import/jira",
      ...formAutoContent({
        email: "grogu@example.com",
        token: "thisissecret",
        host: "https://groguteam.atlassian.net",
        jql: "project in (b1)",
        startStatus: "in progress",
        finishStatus: "done",
      }),
    });

    const errors = parse(response.body)
      .querySelectorAll(".notification")
      .flatMap((e) => e.getElementsByTagName("li"))
      .map((e) => e.textContent);

    expect(response.statusCode).toEqual(502);
    expect(errors).toContain("something bad during import");
  });

  it("shows errors and internal server error when something unknown happens", async () => {
    (saveJsonE as jest.Mock).mockImplementationOnce(() => {
      throw new RangeError("random error");
    });

    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "POST",
      url: "/import/jira",
      ...formAutoContent({
        email: "grogu@example.com",
        token: "thisissecret",
        host: "https://groguteam.atlassian.net",
        jql: "project in (b1)",
        startStatus: "in progress",
        finishStatus: "done",
      }),
    });

    const errors = parse(response.body)
      .querySelectorAll(".notification")
      .flatMap((e) => e.getElementsByTagName("li"))
      .map((e) => e.textContent);
    expect(errors).toContain("Something we didn't expect happened");
    expect(response.statusCode).toEqual(500);
  });
});
