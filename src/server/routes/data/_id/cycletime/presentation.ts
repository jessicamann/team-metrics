import { blueGreen, coral, emerald, freesia } from "@app/colors";
import { percentiles } from "@app/common/math";
import { CycleTime } from "@app/cycletime";

type Point = {
  x: Date;
  y: number;
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

export function showAsScatterChart(_data: CycleTime[]) {
  const data: Point[] = _data.map((story: CycleTime) => ({
    x: story.completedAt,
    y: story.cycletime,
    id: story.id,
  }));

  const onlyTimeData = _data.map((d) => d.cycletime);
  const {
    [50]: p50,
    [85]: p85,
    [95]: p95,
  } = percentiles(onlyTimeData, 50, 85, 95);

  const [from, to] = edgeXAxis(data);
  const lintAt50 = toPLine("50%", p50, from, to, blueGreen);
  const lineAt85 = toPLine("85%", p85, from, to, freesia);
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

  return { chart, p50, p85, p95 };
}
