import csv from "csv-parser";
import { createReadStream, existsSync } from "fs";

export function readFromCsvAndDo<T>(
  filepath: string,
  process: (row: unknown, skip: () => void) => T,
): Promise<T[]> {
  if (!existsSync(filepath)) {
    throw new Error("file does not exist");
  }

  const data: T[] = [];
  return new Promise((resolve, reject) => {
    createReadStream(filepath)
      .pipe(csv())
      .on("data", (row) => {
        let skip = false;
        const result = process(row, () => {
          skip = true;
        });
        if (!skip) data.push(result);
      })
      .on("end", () => resolve(data))
      .on("error", (error) => reject(error));
  });
}
