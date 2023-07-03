import { existsSync } from "fs";

export type InputData = {
  id: string;
  endDate: string;
  startDate: string;
  feature: string;
};

export class TeamNotFoundError extends Error {}

export function getById(id: string): InputData[] {
  if (!existsSync(`./uploads/${id}.json`)) {
    throw new TeamNotFoundError();
  }

  const path = `../../uploads/${id}.json`;
  return require(path);
}
