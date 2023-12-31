import csv from "csvtojson";
import { generate } from "randomstring";
import { existsSync, writeFileSync } from "fs";
import { Readable } from "stream";
import { Either } from "purify-ts";

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

export function existsById(id: string): boolean {
  return existsSync(`./uploads/${id}.json`);
}

export async function save(stream: Readable): Promise<string> {
  const content = await csv().fromStream(stream);

  const id = generate(5);
  writeFileSync(`./uploads/${id}.json`, JSON.stringify(content));

  return id;
}

export function saveJson(inputData: Array<InputData>): string {
  const id = generate(5);
  writeFileSync(`./uploads/${id}.json`, JSON.stringify(inputData));

  return id;
}

export function saveJsonE(inputData: Array<InputData>): Either<Error, string> {
  return Either.of(saveJson(inputData));
}
