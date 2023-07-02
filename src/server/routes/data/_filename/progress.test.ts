import { writeFileSync } from "fs";
import { buildServer } from "@app/server";

describe("GET /data/:filname/progress", () => {
  beforeAll(() => {
    writeFileSync(
      "./uploads/progress-test.csv",
      "id,startDate,endDate,feature\nfoo,2023-01-01,2023-01-04,FeatureB",
    );
  });

  it("returns a 404 if a given file does not exist", async () => {
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar/progress",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the the metrics home page for the uploaded file", async () => {
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/progress-test/progress",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatch(/<\/html>/);
    expect(response.body).toMatch(/Progress/);
  });

  it("returns only the specified features if provided in the request", async () => {
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/progress-test/progress?features=FeatureB",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatch(/FeatureB/);
    expect(response.body).not.toMatch(/FeatureA/);
  });
});
