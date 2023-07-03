import { TeamNotFoundError, getById } from "@app/common/repository";
import { buildServer } from "@app/server";

const mockIntoProgressData = jest.fn();
jest.mock("@app/common/repository");
jest.mock("@app/progress", () => ({
  intoProgressData: mockIntoProgressData,
  groupByFeature: () => {},
}));

describe("GET /data/:id/progress", () => {
  it("returns a 404 if a given file does not exist", async () => {
    (getById as jest.Mock).mockImplementationOnce(() => {
      throw new TeamNotFoundError();
    });
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar/progress",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the Progress page", async () => {
    mockIntoProgressData.mockResolvedValueOnce([]);
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
