import { intoProgressData } from "./reader";

describe("intoProgressData", () => {
  it("skips any story without a feature", () => {
    const input = [
      {
        id: "Team-123",
        startDate: "",
        endDate: "",
        feature: "",
      },
      {
        id: "nTEAM-2",
        startDate: "2023-06-09",
        endDate: "2023-06-14",
        feature: "",
      },
    ];

    const result = intoProgressData(input);

    expect(result).toHaveLength(0);
  });

  it("returns all stories with a feature", () => {
    const input = [
      {
        id: "Team-123",
        startDate: "",
        endDate: "",
        feature: "A",
      },
      {
        id: "nTEAM-2",
        startDate: "2023-06-09",
        endDate: "2023-06-14",
        feature: "B",
      },
    ];

    const result = intoProgressData(input);

    expect(result).toHaveLength(2);
  });

  it("skips any story not part a feature, if an exlusion is provided", () => {
    const input = [
      {
        id: "Team-123",
        startDate: "",
        endDate: "",
        feature: "A",
      },
      {
        id: "nTEAM-2",
        startDate: "2023-06-09",
        endDate: "2023-06-14",
        feature: "B",
      },
    ];

    const result = intoProgressData(input, { only: "A" });

    expect(result).toHaveLength(1);
  });

  it("skips any story not part a list of features, if an exlusion list is provided", () => {
    const input = [
      {
        id: "Team-123",
        startDate: "",
        endDate: "",
        feature: "A",
      },
      {
        id: "nTEAM-2",
        startDate: "2023-06-09",
        endDate: "2023-06-14",
        feature: "B",
      },
      {
        id: "nTEAM-2",
        startDate: "2023-06-09",
        endDate: "2023-06-14",
        feature: "C",
      },
    ];
    const result = intoProgressData(input, { only: ["A", "B"] });

    expect(result).toHaveLength(2);
  });

  it("determines the status is done if the story has an end date", () => {
    const input = [
      { id: "Team-123", startDate: "", endDate: "2020-01-23", feature: "A" },
    ];

    const result = intoProgressData(input);
    expect(result).toEqual([{ feature: "A", status: "Done" }]);
  });

  it("determines the story as in progress if it has a start date but no end date", () => {
    const input = [
      { id: "Team-123", startDate: "2020-01-01", endDate: "", feature: "A" },
    ];

    const result = intoProgressData(input);
    expect(result).toEqual([{ feature: "A", status: "In progress" }]);
  });

  it("determines the story as not started if there is no start date or end date", () => {
    const input = [
      { id: "Team-123", startDate: "", endDate: "", feature: "A" },
    ];

    const result = intoProgressData(input);

    expect(result).toEqual([{ feature: "A", status: "Not started" }]);
  });
});
