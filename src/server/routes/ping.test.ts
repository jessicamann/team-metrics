import { buildServer } from "..";

describe("GET /ping", () => {
  it("returns 200 and 'pong' when healthy", async () => {
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/ping",
    });

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual({ ping: "pong" });
  });
});
