import { TeamNotFoundError, getById } from "@app/common/repository";
import { buildServer } from "@app/server";

const mockIntoCycleTime = jest.fn();
jest.mock("@app/common/repository");
jest.mock("@app/cycletime", () => ({
  intoCycleTime: mockIntoCycleTime,
}));

describe("GET /data/:id/cycletime", () => {
  it("returns a 404 if a given file does not exist", async () => {
    (getById as jest.Mock).mockImplementationOnce(() => {
      throw new TeamNotFoundError();
    });
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar/cycletime",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the cycletime page", async () => {
    mockIntoCycleTime.mockReturnValueOnce([
      {
        id: "1",
        completedAt: new Date(),
        cycletime: 2,
      },
    ]);
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
