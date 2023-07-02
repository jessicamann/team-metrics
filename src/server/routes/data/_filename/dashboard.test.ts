import { writeFileSync } from "fs";
import { buildServer } from "../../..";

describe("GET /data/:filname/dashboard", () => {
  beforeAll(() => {
    writeFileSync("./uploads/dashboard-test.csv", "id,startDate,endDate\nfoo,2023-01-01,2023-01-04")
  })
  it("returns a 404 if a given file does not exist", async () => {
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar/dashboard",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the the metrics home page for the uploaded file", async () => {
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
