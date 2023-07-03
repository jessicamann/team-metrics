import { TeamNotFoundError, getById } from "@app/common/repository";
import { cycletimesSummary } from "@app/dashboard/cycletime";
import { forecastSummary } from "@app/dashboard/forecast";
import { buildServer } from "@app/server";

jest.mock("@app/common/repository");
jest.mock("@app/dashboard/cycletime", () => ({
  cycletimesSummary: jest.fn(),
}));
jest.mock("@app/dashboard/forecast", () => ({
  forecastSummary: jest.fn(),
}));

describe("GET /data/:filname/dashboard", () => {
  it("returns a 404 if a given file does not exist", async () => {
    (getById as jest.Mock).mockImplementationOnce(() => {
      throw new TeamNotFoundError();
    });
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar/dashboard",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the the metrics home page for the uploaded file", async () => {
    (cycletimesSummary as jest.Mock).mockReturnValueOnce({ outliers: [] });
    (forecastSummary as jest.Mock).mockReturnValueOnce([]);
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
