// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import formAutoContent from "form-auto-content";
import { createReadStream, existsSync } from "fs";
import { buildServer } from "..";

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
      myFile: createReadStream(`${__dirname}/test-file.csv`),
    });

    const response = await server.inject({
      method: "POST",
      url: "/data",
      ...form,
    });

    expect(response.statusCode).toEqual(201);
    expect(existsSync("./uploads/test-file.csv")).toBeTruthy();
  });
});
