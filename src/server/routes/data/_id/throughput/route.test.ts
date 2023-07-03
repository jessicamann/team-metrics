import { TeamNotFoundError } from "@app/common/repository";
import { buildServer } from "@app/server";

const mockIntoThroughput = jest.fn();
jest.mock("@app/common/repository");
jest.mock("@app/throughput", () => ({
  intoThroughput: mockIntoThroughput,
}));

describe("GET /data/:id/throughput", () => {
  it("returns a 404 if a given file does not exist", async () => {
    mockIntoThroughput.mockImplementationOnce(() => {
      throw new TeamNotFoundError();
    });
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar/throughput",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the the metrics home page for the uploaded file", async () => {
    mockIntoThroughput.mockImplementationOnce(() => ({
      count: () => [],
    }));
    const server = buildServer({ logger: false });
    await server.ready();

    const response = await server.inject({
      method: "GET",
      url: "/data/throughput-test/throughput",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatch(/<\/html>/);
    expect(response.body).toMatch(/Weekly Throughput/);
  });
});
