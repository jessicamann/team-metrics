import { buildServer } from "../..";

describe("GET /oops", () => {
  it("returns oops page", async () => {
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/oops",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatch(/<\/html>/);
    expect(response.body).toMatch(/Oops/);
  });
});
