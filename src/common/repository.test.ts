import { createReadStream, existsSync, mkdirSync, writeFileSync } from "fs";
import { TeamNotFoundError, existsById, getById, save } from "./repository";

jest.mock("randomstring", () => ({
  generate: () => "random-id",
}));

const id = "test";

beforeAll(() => {
  if (!existsSync("./uploads")) {
    mkdirSync("./uploads");
  }
  writeFileSync(`./uploads/${id}.json`, '{"foo":"bar"}');
});

describe("save", () => {
  it("saves the content as json and returns the generated id", async () => {
    const readable = createReadStream("./fixtures/test-file.csv");
    const id = await save(readable);

    expect(id).toEqual("random-id");
    expect(require("../../uploads/random-id.json")).toEqual([
      {
        header1: "foo",
        header2: "bar",
      },
    ]);
  });
});

describe("existsById", () => {
  it("returns false if the file does not exist", () => {
    expect(existsById("does-not-exist")).toEqual(false);
  });
  it("returns true if the file does not exist", () => {
    expect(existsById(id)).toEqual(true);
  });
});

describe("getById", () => {
  it("throws an error if data with id does not exist", () => {
    expect(() => getById("does-not-exist")).toThrowError(TeamNotFoundError);
  });
  it("returns the data for that id", () => {
    expect(getById(id)).toEqual({ foo: "bar" });
  });
});
