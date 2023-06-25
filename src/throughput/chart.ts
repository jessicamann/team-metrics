import { bluePurple, opal } from "../colors";
import { byWeek } from "./durations";
import { readAsStory } from "./reader";

export async function showAsLineChart(filepath: string) {
  const data = await readAsStory(filepath);
  const throughput = data
    .toThroughput(byWeek)
    .sort((a, b) => a.periodEnd.getTime() - b.periodEnd.getTime());

  return {
    type: "line",
    data: {
      datasets: [
        {
          label: "count",
          data: throughput.map((d) => ({ x: d.periodEnd, y: d.total })),
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
