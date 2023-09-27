import { Either } from "purify-ts";

export class TeamNotFoundError extends Error {}
export const getById = jest.fn().mockReturnValue([]);
export const existsById = jest.fn().mockReturnValue(true);
export const save = jest.fn().mockResolvedValue("test-id");
export const saveJson = jest.fn().mockReturnValue("test-id");
export const saveJsonE = jest.fn().mockReturnValue(Either.of("test-id"));
