import { TeamNotFoundError } from "@app/common/repository";
import { showAsDonutChartsByFeature } from "@app/progress";
import { buildServer } from "@app/server";

jest.mock("@app/progress", () => ({
  showAsDonutChartsByFeature: jest.fn(),
}));

describe("GET /data/:filname/progress", () => {
  it("returns a 404 if a given file does not exist", async () => {
    (showAsDonutChartsByFeature as jest.Mock).mockRejectedValueOnce(
      new TeamNotFoundError(),
    );
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar/progress",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the the metrics home page for the uploaded file", async () => {
    (showAsDonutChartsByFeature as jest.Mock).mockResolvedValueOnce([]);
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/progress-test/progress",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatch(/<\/html>/);
    expect(response.body).toMatch(/Progress/);
  });
});