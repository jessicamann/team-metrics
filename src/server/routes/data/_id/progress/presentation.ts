import { blush, cyberYellow, emerald, gray } from "@app/colors";
import { InputData } from "@app/common/repository";
import {
  countByStatus,
  groupByFeature,
  intoProgressData,
  Options,
  StoryData,
} from "@app/progress";
import { map } from "lodash";

function toOneDonutChart(feature: string, stories: StoryData[]) {
  const count = countByStatus(stories);
  return {
    type: "doughnut",
    data: {
      labels: ["Not started", "In progress", "Done"],
      datasets: [
        {
          label: "stories",
          data: [count["Not started"], count["In progress"], count.Done],
          backgroundColor: [gray, cyberYellow, emerald, blush],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: feature,
          position: "top",
          fontSize: 16,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  };
}

export function showAsDonutChartsByFeature(
  data: InputData[],
  options?: Options,
) {
  const stories = intoProgressData(data, options);
  const byFeatures = groupByFeature(stories);

  return map(byFeatures, (value, key) => toOneDonutChart(key, value));
}
