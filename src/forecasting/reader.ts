import { byWeek, readAsThroughput } from "@app/throughput";
import { readFromCsvAndDo } from "@app/common/csv";

type ForecastingData = {
  remaining: number;
  throughput: number[];
};

async function readInUnfinishedStories(filepath: string): Promise<number> {
  const result = await readFromCsvAndDo(filepath, (row, skip) => {
    const { endDate } = row as { endDate: string };

    if (!endDate) return row;
    skip();
  });

  return result.length;
}

export async function readIntoForecastingData(
  filepath: string,
): Promise<ForecastingData> {
  const throughputPromise = readAsThroughput(filepath).then((r) =>
    r.toThroughput(byWeek).map((d) => d.total),
  );
  const remainingWorkPromise = readInUnfinishedStories(filepath);

  const [throughput, remaining] = await Promise.all([
    throughputPromise,
    remainingWorkPromise,
  ]);

  return { throughput, remaining };
}
