import { blueGreen, coral, emerald, freesia } from "../colors";
import { percentileAt } from "./confidence";
import { toCycleTime } from "./data";

type CycleTime = number;
export type Point = {
  x: Date;
  y: CycleTime;
};

function edgeXAxis(data: Point[]) {
  const sorted = data.sort((a, b) => {
    return b.x.getTime() - a.x.getTime();
  });
  return [sorted[0].x, sorted[sorted.length - 1].x];
}

function toPLine(
  label: string,
  value: number,
  from: Date,
  to: Date,
  color: string,
) {
  return {
    label: label,
    data: [
      { x: from, y: value },
      { x: to, y: value },
    ],
    borderColor: color,
    borderWidth: 1.5,
    pointRadius: 0,
    pointHoverRadius: 0,
    fill: false,
    tension: 0,
    showLine: true,
  };
}

export async function toScatterChart(filepath: string) {
  const data: Point[] = (await toCycleTime(filepath)).map((story) => ({
    x: story.completedAt,
    y: story.cycletime,
    id: story.id,
  }));
  const [from, to] = edgeXAxis(data);
  const p50 = percentileAt(50, data);
  const lintAt50 = toPLine("50%", p50, from, to, blueGreen);
  const p85 = percentileAt(85, data);
  const lineAt85 = toPLine("85%", p85, from, to, freesia);
  const p95 = percentileAt(95, data);
  const lineAt95 = toPLine("95%", p95, from, to, coral);

  const chart = {
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
        lintAt50,
        lineAt85,
        lineAt95,
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

  return {
    chart,
    p50: p50,
    p85: p85,
    p95: p95,
  };
}
