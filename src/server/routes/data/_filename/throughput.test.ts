import { TeamNotFoundError } from "@app/common/repository";
import { buildServer } from "@app/server";
import { showAsLineChart } from "@app/throughput";

jest.mock("@app/throughput", () => ({
  showAsLineChart: jest.fn(),
}));

describe("GET /data/:filname/throughput", () => {
  it("returns a 404 if a given file does not exist", async () => {
    (showAsLineChart as jest.Mock).mockRejectedValueOnce(
      new TeamNotFoundError(),
    );
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar/throughput",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the the metrics home page for the uploaded file", async () => {
    (showAsLineChart as jest.Mock).mockResolvedValueOnce({});
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/throughput-test/throughput",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatch(/<\/html>/);
    expect(response.body).toMatch(/Weekly Throughput/);
  });
});
