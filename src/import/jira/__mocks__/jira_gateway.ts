import { Either, EitherAsync } from "purify-ts";

export const flowMetrics = jest.fn().mockResolvedValue([]);
export const flowMetricsE = jest
  .fn()
  .mockReturnValue(EitherAsync.liftEither(Either.of([])));
