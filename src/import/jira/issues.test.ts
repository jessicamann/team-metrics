import { Version3Client } from "jira.js";
import { allIssues } from "./issues";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import path from "path";

const SECONDS = 1000;

describe("Jira Issue Import", () => {
  let container: StartedTestContainer;

  beforeAll(async () => {
    container = await new GenericContainer("bbyars/mountebank:2.8.2")
      .withExposedPorts(4545)
      .withCopyFilesToContainer(
        ["issue-search.ejs", "one-issue.ejs"].map(toFileInFixtureDir),
      )
      .withCommand(["--configfile", "/stubs/issue-search.ejs"])
      .start();
  }, 70 * SECONDS);

  afterAll(async () => {
    await container.stop();
  });

  it("fetches all issues for the query provided", async () => {
    const client = new Version3Client({
      host: `http://localhost:${container.getMappedPort(4545)}`,
      authentication: {
        basic: {
          email: "grogu@example.com",
          apiToken: "secret-token",
        },
      },
    });

    const issues = await allIssues(client, "project in (b1)", {
      maxResults: 1,
    });

    expect(issues.length).toEqual(3);

    const [firstIssue, _rest] = issues;
    expect(firstIssue).toHaveProperty("key");
    expect(firstIssue).toHaveProperty("fields.summary");
    expect(firstIssue).toHaveProperty("changelog");
  });
});

function toFileInFixtureDir(filename: string) {
  return {
    source: path.resolve(__dirname, "../../../fixtures/stub", filename),
    target: `/stubs/${filename}`,
  };
}
