import formAutoContent from "form-auto-content";
import { saveJson } from "@app/common/repository";
import { flowMetrics } from "@app/import/jira/jira_gateway";
import { buildServer } from "..";

jest.mock("@app/common/repository");
jest.mock("@app/import/jira/jira_gateway");

describe("POST /import-jira-cards", () => {
  it("redirects to /data/{id} on successful import", async () => {
    (saveJson as jest.Mock).mockReturnValueOnce("test-id");
    (flowMetrics as jest.Mock).mockResolvedValueOnce([]);

    const server = buildServer({ logger: true });

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
});
