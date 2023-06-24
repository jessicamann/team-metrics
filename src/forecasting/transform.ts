import { readFromCsvAndDo } from "../common/csv";

export async function readInUnfinishedStories(
  filepath: string,
): Promise<number> {
  const result = await readFromCsvAndDo(filepath, (row, skip) => {
    const { startDate } = row as { startDate: string };

    if (startDate) return row;
    skip();
  });

  return result.length;
}
