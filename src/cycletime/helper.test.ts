import { cycletimeBetween } from "./helper";

describe("cycletimeBetween", () => {
  it("returns 1 calendar day if work start and end on the same day", () => {
    expect(
      cycletimeBetween(new Date("2023-06-23"), new Date("2023-06-23")),
    ).toEqual(1);
  });

  it("returns 2 days if work ends the day after it begins", () => {
    expect(
      cycletimeBetween(new Date("2023-06-24"), new Date("2023-06-23")),
    ).toEqual(2);
  });

  it("throws an error if the work ended before it began", () => {
    expect(() =>
      cycletimeBetween(new Date("2023-06-24"), new Date("2023-06-25")),
    ).toThrow("you've figured out time travel.");
  });
});
