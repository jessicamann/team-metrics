import { TeamNotFoundError } from "@app/common/repository";
import { cycletimesSummary, forecastSummary } from "@app/dashboard";
import { buildServer } from "@app/server";

jest.mock("@app/dashboard", () => ({
  cycletimesSummary: jest.fn(),
  forecastSummary: jest.fn(),
}));

describe("GET /data/:filname/dashboard", () => {
  it("returns a 404 if a given file does not exist", async () => {
    (cycletimesSummary as jest.Mock).mockRejectedValueOnce(
      new TeamNotFoundError(),
    );
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar/dashboard",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the the metrics home page for the uploaded file", async () => {
    (cycletimesSummary as jest.Mock).mockResolvedValueOnce({ outliers: [] });
    (forecastSummary as jest.Mock).mockResolvedValueOnce([]);
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/dashboard-test/dashboard",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatch(/<\/html>/);
    expect(response.body).toMatch(/Dashboard/);
  });
});
