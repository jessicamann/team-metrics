import { Version3Client } from "jira.js";
import { allIssues } from "./issues";

describe("Jira Issue Import", () => {
  it.skip("pending stub setup - fetches all issues for the query provided", async () => {
    const client = new Version3Client({
      host: "http://localhost:4545",
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
