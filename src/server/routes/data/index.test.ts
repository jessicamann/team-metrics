// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: this library is not type friendly
import formAutoContent from "form-auto-content";
import { createReadStream, existsSync, mkdirSync, writeFileSync } from "fs";
import { buildServer } from "@app/server";
import { existsById } from "@app/common/repository";

jest.mock("@app/common/repository");
jest.mock("randomstring", () => ({
  generate: () => "test-id",
}));

describe("POST /data", () => {
  beforeAll(() => {
    if (existsSync("./uploads")) return;
    mkdirSync("./uploads");
  });

  it("returns 406 if no file was provided", async () => {
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "POST",
      url: "/data",
    });

    expect(response.statusCode).toEqual(406);
  });

  it("redirects user to the team home page if file was uploaded successfully", async () => {
    const server = buildServer({ logger: false });

    const form = formAutoContent({
      myFile: createReadStream("./fixtures/test-file.csv"),
    });

    const response = await server.inject({
      method: "POST",
      url: "/data",
      ...form,
    });

    expect(response.statusCode).toEqual(303);
    expect(response.headers.location).toEqual("/data/test-id");
    expect(existsSync("./uploads/test-id.json")).toBeTruthy();
  });
});

describe("GET /data/:filename", () => {
  it("returns a 404 if a given file does not exist", async () => {
    (existsById as jest.Mock).mockReturnValue(false);
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the the metrics home page for the uploaded file", async () => {
    (existsById as jest.Mock).mockReturnValue(true);
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foo-test",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatch(/<\/html>/);
  });
});
