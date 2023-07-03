import { InputData } from "@app/common/repository";
import { CycleTime } from "./types";
import { asCycleTime, isComplete } from "./helper";

export function toCycleTime(input: InputData[]): CycleTime[] {
  return input.filter(isComplete).map(asCycleTime);
}
