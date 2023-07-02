import { writeFileSync } from "fs";
import { buildServer } from "@app/server";

describe("GET /data/:filname/forecast/", () => {
  beforeAll(() => {
    writeFileSync(
      "./uploads/forecast-test.csv",
      "id,startDate,endDate\nfoo,2023-01-01,2023-01-04",
    );
  });

  it("returns a 404 if a given file does not exist", async () => {
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar/forecast",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the the metrics home page for the uploaded file", async () => {
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
