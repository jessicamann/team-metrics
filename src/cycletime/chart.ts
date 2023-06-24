import { emerald } from "../colors";
import { toCycleTime } from "./data";

type CycleTime = number;
type Point = {
  x: Date;
  y: CycleTime;
};

export async function toScatterChart(filepath: string) {
  const data: Point[] = (await toCycleTime(filepath)).map((story) => ({
    x: story.completedAt,
    y: story.cycletime,
    id: story.id,
  }));

  return {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "story",
          borderColor: emerald,
          backgroundColor: emerald,
          borderWidth: 0.3,
          data: [...data],
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Cycle time",
        position: "top",
        fontSize: 16,
      },
      legend: {
        position: "bottom",
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              unit: "month",
              tooltipFormat: "YYYY-DD-MM",
            },
          },
        ],
      },
    },
  };
}
