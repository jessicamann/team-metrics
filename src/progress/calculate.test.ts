import { countByStatus, groupByFeature } from "./calculate";

describe("groupByFeature", () => {
  it("returns the stories grouped under shared featuress", () => {
    const result = groupByFeature([
      { feature: "A", status: "Done" },
      { feature: "A", status: "Not started" },
      { feature: "B", status: "Not started" },
    ]);

    expect(result).toEqual({
      A: [
        { feature: "A", status: "Done" },
        { feature: "A", status: "Not started" },
      ],
      B: [{ feature: "B", status: "Not started" }],
    });
  });
});

describe("countByStatus", () => {
  it("returns 0 for count if the story has no particular status", () => {
    const result = countByStatus([
      { feature: "A", status: "Done" },
      { feature: "A", status: "Not started" },
    ]);

    expect(result["In progress"]).toEqual(0);
  });

  it("returns the number of stories under each status", () => {
    const result = countByStatus([
      { feature: "A", status: "In progress" },
      { feature: "A", status: "In progress" },
      { feature: "A", status: "Done" },
      { feature: "A", status: "Not started" },
    ]);

    expect(result["In progress"]).toEqual(2);
    expect(result["Done"]).toEqual(1);
    expect(result["Not started"]).toEqual(1);
  });
});
