import { subDays } from "date-fns";
import { toOutlyingItems } from "./outliers";

it("returns empty list if cycle time data is empty", () => {
  const actual = toOutlyingItems([]);
  expect(actual).toEqual([]);
});

it("returns empty list if all items completed under 85 percentile", () => {
  const actual = toOutlyingItems([
    { completedAt: new Date(), id: "1", cycletime: 4 },
    { completedAt: new Date(), id: "2", cycletime: 1 },
  ]);
  expect(actual).toEqual([]);
});

it("returns list of ids of all items completed on or over 85 percentile", () => {
  const actual = toOutlyingItems([
    { completedAt: subDays(new Date(), 5), cycletime: 5, id: "foo" },
    { completedAt: subDays(new Date(), 2), cycletime: 4, id: "i am good" },
    { completedAt: subDays(new Date(), 1), cycletime: 13, id: "bar" },
    { completedAt: subDays(new Date(), 1), cycletime: 22, id: "yz" },
    { completedAt: subDays(new Date(), 1), cycletime: 2, id: "asd" },
    { completedAt: subDays(new Date(), 1), cycletime: 1, id: "abc" },
    { completedAt: subDays(new Date(), 1), cycletime: 100, id: "z" },
  ]);
  expect(actual).toEqual(["z"]);
});
