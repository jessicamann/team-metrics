import { buildServer } from ".";

it("redirects to /oops when the route is not found", async () => {
  const server = buildServer({ logger: false });

  const response = await server.inject({
    method: "GET",
    url: "/nothing-here",
  });

  expect(response.statusCode).toEqual(303);
  expect(response.headers.location).toEqual("/oops");
});

it("returns a generic error message when something unexpectedly blows up", async () => {
  const server = buildServer({ logger: false });

  server.get("/bomb", () => {
    throw new Error("shhhhh, don't give them the details");
  });

  const response = await server.inject({
    method: "GET",
    url: "/bomb",
  });

  expect(response.statusCode).toEqual(500);
  expect(JSON.parse(response.body)).toEqual({
    error: "internal server error; we'll take a look on our end.",
  });
});
