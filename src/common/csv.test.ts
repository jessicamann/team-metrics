import { readFromCsvAndDo } from "./csv";

describe("readFromCsvAndDo", () => {
  it("returns the csv records after transform", async () => {
    const result = await readFromCsvAndDo("./fixtures/test-file.csv", (row) => {
      const { header1, header2 } = row as any;
      return { first: header1, second: header2 };
    });

    expect(result).toEqual([{ first: "foo", second: "bar" }]);
  });

  it("returns the transformed rows without the skipped records", async () => {
    const result = await readFromCsvAndDo(
      "./fixtures/test-file.csv",
      (row, skip) => skip(),
    );

    expect(result).toEqual([]);
  });

  it("errors if file does not exist", () => {
    expect(() =>
      readFromCsvAndDo("./fixtures/does-not-exist.csv", (row, skip) => skip()),
    ).toThrowError(/file does not exist/);
  });
});
