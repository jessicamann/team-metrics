import { TeamNotFoundError, getById } from "@app/common/repository";
import { buildServer } from "@app/server";

const mockForecast = jest.fn();
jest.mock("@app/common/repository");
jest.mock("@app/forecasting/api", () => ({
  forecast: mockForecast,
}));

describe("GET /data/:filname/forecast/", () => {
  it("returns a 404 if a given file does not exist", async () => {
    (getById as jest.Mock).mockImplementationOnce(() => {
      throw new TeamNotFoundError();
    });
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar/forecast",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the forecast page", async () => {
    mockForecast.mockReturnValueOnce({
      remaining: 3,
      simulate: () => [1, 2, 3],
    });

    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/forecast-test/forecast",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatch(/<\/html>/);
    expect(response.body).toMatch(/Forecast/);
  });
});
