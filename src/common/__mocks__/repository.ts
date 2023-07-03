export class TeamNotFoundError extends Error {}
export const getById = jest.fn().mockReturnValue([]);
export const existsById = jest.fn().mockReturnValue(true);
export const save = jest.fn().mockResolvedValue("test-id");
