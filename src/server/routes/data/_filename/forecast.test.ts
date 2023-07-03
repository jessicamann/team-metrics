import { TeamNotFoundError } from "@app/common/repository";
import { showAsCalendar } from "@app/forecasting";
import { buildServer } from "@app/server";

jest.mock("@app/forecasting", () => ({
  showAsCalendar: jest.fn(),
}));

describe("GET /data/:filname/forecast/", () => {
  it("returns a 404 if a given file does not exist", async () => {
    (showAsCalendar as jest.Mock).mockRejectedValueOnce(
      new TeamNotFoundError(),
    );
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar/forecast",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the the metrics home page for the uploaded file", async () => {
    (showAsCalendar as jest.Mock).mockResolvedValueOnce({});
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
