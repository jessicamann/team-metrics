import { endOfWeek, format } from "date-fns";
import { byWeek } from "./durations";

describe("byWeek", () => {
  it("groups the stories completed in the same week", () => {
    const result = byWeek([
      { id: "1", completedAt: new Date("2023-02-04") }, // a saturday
      { id: "2", completedAt: new Date("2023-02-05") }, // a sunday
      { id: "3", completedAt: new Date("2023-02-06") }, // a monday
    ]);

    const firstWeek = endOfWeek(new Date("2023-02-04"));
    const secondWeek = endOfWeek(new Date("2023-02-06"));
    expect(result).toEqual({
      [firstWeek.toString()]: [
        { id: "1", completedAt: new Date("2023-02-04") },
      ],
      [secondWeek.toString()]: [
        { id: "2", completedAt: new Date("2023-02-05") },
        { id: "3", completedAt: new Date("2023-02-06") },
      ],
    });
  });
});
