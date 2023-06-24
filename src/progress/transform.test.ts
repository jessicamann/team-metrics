import { writeFileSync } from "fs";
import { readAsStoryData } from "./transform";

describe("readAsStoryData", () => {
  it("skips any story without a feature", async () => {
    writeFileSync(
      "./fixtures/progress-transform-test.csv",
      "id,startDate,endDate\nTeam-123,,\nTEAM-2,2023-06-09,2023-06-14\n",
    );

    const result = await readAsStoryData(
      "./fixtures/progress-transform-test.csv",
    );

    expect(result).toHaveLength(0);
  });

  it("skips any story not part a feature, if an exlusion is provided", async () => {
    writeFileSync(
      "./fixtures/progress-transform-test.csv",
      "id,startDate,endDate,feature\nTeam-123,,,A\nTEAM-2,2023-06-09,2023-06-14,B\n",
    );

    const result = await readAsStoryData(
      "./fixtures/progress-transform-test.csv",
      { only: "A" },
    );

    expect(result).toHaveLength(1);
  });

  it("skips any story not part a list of features, if an exlusion list is provided", async () => {
    writeFileSync(
      "./fixtures/progress-transform-test.csv",
      "id,startDate,endDate,feature\nTeam-123,,,A\nTEAM-2,2023-06-09,2023-06-14,B\nTEAM-6,2023-06-09,2023-06-14,C\n",
    );

    const result = await readAsStoryData(
      "./fixtures/progress-transform-test.csv",
      { only: ["A", "B"] },
    );

    expect(result).toHaveLength(2);
  });

  it("determines the status is done if the story has an end date", async () => {
    writeFileSync(
      "./fixtures/progress-transform-test.csv",
      "id,startDate,endDate,feature\nTeam-123,,2020-01-23,A\n",
    );

    const result = await readAsStoryData(
      "./fixtures/progress-transform-test.csv",
    );

    expect(result).toEqual([{ feature: "A", status: "Done" }]);
  });

  it("determines the story as in progress if it has a start date but no end date", async () => {
    writeFileSync(
      "./fixtures/progress-transform-test.csv",
      "id,startDate,endDate,feature\nTeam-123,2020-01-01,,A\n",
    );

    const result = await readAsStoryData(
      "./fixtures/progress-transform-test.csv",
    );

    expect(result).toEqual([{ feature: "A", status: "In progress" }]);
  });

  it("determines the story as not started if there is no start date or end date", async () => {
    writeFileSync(
      "./fixtures/progress-transform-test.csv",
      "id,startDate,endDate,feature\nTeam-123,,,A\n",
    );

    const result = await readAsStoryData(
      "./fixtures/progress-transform-test.csv",
    );

    expect(result).toEqual([{ feature: "A", status: "Not started" }]);
  });
});
