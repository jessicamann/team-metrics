import { bluePurple, opal } from "../colors";
import { readFromCsvAndDo } from "../common/csv";
import { byWeek, toThroughput } from "./calculate";
import { StoryData } from "./type";

export function readAsStory(filepath: string) {
  return readFromCsvAndDo<StoryData>(filepath, (row, skip) => {
    const { id, endDate } = row as {
      id: string;
      endDate: string;
    };
    if (!endDate) {
      skip();
    }

    return { id, completedAt: new Date(endDate) };
  });
}

export async function toWeeklyThroughput(filepath: string) {
  const data = toThroughput(await readAsStory(filepath), byWeek).sort(
    (a, b) => a.periodEnd.getTime() - b.periodEnd.getTime(),
  );

  return {
    type: "line",
    data: {
      datasets: [
        {
          label: "count",
          data: data.map((d) => ({ x: d.periodEnd, y: d.total })),
          fill: false,
          borderColor: bluePurple,
          backgroundColor: bluePurple,
          borderWidth: 1.5,
          trendlineLinear: {
            colorMin: opal,
            colorMax: opal,
            lineStyle: "dotted",
            width: 3,
          },
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Weekly Throughput",
        position: "top",
        fontSize: 16,
      },
      legend: {
        position: "bottom",
      },
      scales: {
        y: { title: { display: true, text: "Stories Completed" } },
        x: {
          title: { display: true, text: "Week" },
          type: "time",
          time: { tooltipFormat: "yyyy-MM-dd" },
        },
      },
    },
  };
}
