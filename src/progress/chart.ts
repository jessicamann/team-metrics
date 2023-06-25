import { map } from "lodash";
import { blush, cyberYellow, emerald, gray } from "../colors";
import { countByStatus, groupByFeature } from "./calculate";
import { readAsStoryData } from "./reader";
import { Options, StoryData } from "./type";

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

export async function showAsDonutChartsByFeature(
  filepath: string,
  options?: Options,
) {
  const stories = await readAsStoryData(filepath, options);
  const byFeatures = groupByFeature(stories);

  return map(byFeatures, (value, key) => toOneDonutChart(key, value));
}
