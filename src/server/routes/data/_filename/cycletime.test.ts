import { writeFileSync, writeSync } from "fs";
import { buildServer } from "@app/server";

describe("GET /data/:filname/cycletime", () => {
  beforeAll(() => {
    writeFileSync(
      "./uploads/cycletime-file.csv",
      "id,startDate,endDate\nfoo,2023-01-01,2023-01-04",
    );
  });

  it("returns a 404 if a given file does not exist", async () => {
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar/cycletime",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the the metrics home page for the uploaded file", async () => {
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/cycletime-file/cycletime",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatch(/<\/html>/);
    expect(response.body).toMatch(/Team Cycle Time/);
  });
});
