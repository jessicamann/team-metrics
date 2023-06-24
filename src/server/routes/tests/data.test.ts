// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: this library is not type friendly
import formAutoContent from "form-auto-content";
import { createReadStream, existsSync, writeFileSync } from "fs";
import { buildServer } from "../..";

describe("POST /data", () => {
  it("returns 406 if no file was provided", async () => {
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "POST",
      url: "/data",
    });

    expect(response.statusCode).toEqual(406);
  });

  it("retruns 201 if file was uploaded successfully", async () => {
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
    expect(response.headers.location).toEqual("/data/test-file");
    expect(existsSync("./uploads/test-file.csv")).toBeTruthy();
  });
});

describe("GET /data/:filename", () => {
  it("returns a 404 if a given file does not exist", async () => {
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the the metrics home page for the uploaded file", async () => {
    const server = buildServer({ logger: false });

    writeFileSync("./uploads/test-file.csv", "foobar");

    const response = await server.inject({
      method: "GET",
      url: "/data/test-file",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatch(/<\/html>/);
  });
});

describe("GET /data/:filname/cycletime", () => {
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

    writeFileSync(
      "./uploads/test-file.csv",
      "id,startDate,endDate\nTeam-123,,\nTEAM-2,2023-06-09,2023-06-14\n",
    );

    const response = await server.inject({
      method: "GET",
      url: "/data/test-file/cycletime",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatch(/<\/html>/);
    expect(response.body).toMatch(/Team Cycle Time/);
  });
});

describe("GET /data/:filname/throughput", () => {
  it("returns a 404 if a given file does not exist", async () => {
    const server = buildServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/data/foobar/throughput",
    });

    expect(response.statusCode).toEqual(404);
  });

  it("returns a 200 with the the metrics home page for the uploaded file", async () => {
    const server = buildServer({ logger: false });

    writeFileSync(
      "./uploads/throughput-test.csv",
      "id,startDate,endDate\nTeam-123,,\nTEAM-2,2023-06-09,2023-06-14\n",
    );

    const response = await server.inject({
      method: "GET",
      url: "/data/throughput-test/throughput",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatch(/<\/html>/);
    expect(response.body).toMatch(/Weekly Throughput/);
  });
});

describe("GET /data/:filname/progress", () => {
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

    writeFileSync(
      "./uploads/progress-test.csv",
      "id,startDate,endDate\nTeam-123,,\nTEAM-2,2023-06-09,2023-06-14\n",
    );

    const response = await server.inject({
      method: "GET",
      url: "/data/progress-test/progress",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatch(/<\/html>/);
    expect(response.body).toMatch(/Progress/);
  });
});
