import { TeamNotFoundError } from "@app/common/repository";
import { showAsScatterChart } from "@app/cycletime";
import { buildServer } from "@app/server";

jest.mock("@app/cycletime", () => ({
  showAsScatterChart: jest.fn(),
}));

describe("GET /data/:filname/cycletime", () => {
  it("returns a 404 if a given file does not exist", async () => {
    (showAsScatterChart as jest.Mock).mockRejectedValueOnce(
      new TeamNotFoundError(),
    );
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar/cycletime",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the the metrics home page for the uploaded file", async () => {
    (showAsScatterChart as jest.Mock).mockResolvedValueOnce({});
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/test-file/cycletime",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatch(/<\/html>/);
    expect(response.body).toMatch(/Team Cycle Time/);
  });
});
