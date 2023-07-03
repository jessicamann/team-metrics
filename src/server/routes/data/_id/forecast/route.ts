import { TeamNotFoundError, getById } from "@app/common/repository";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { showAsCalendar } from "./presentation";
import { forecast } from "@app/forecasting/api";

export default async function (f: FastifyInstance) {
  f.get(
    "/",
    (
      request: FastifyRequest<{
        Params: { id: string };
        Querystring: { features: "array" };
      }>,
      reply: FastifyReply,
    ) => {
      const id = request.params.id;

      try {
        const { remaining, simulate } = forecast(getById(id));
        const dates = simulate();

        const { calendarData, confidence } = showAsCalendar(dates);
        reply.view("/templates/forecasts/index.ejs", {
          dataSet: id,
          remainingStories: remaining,
          calendarData,
          p50: confidence.p50,
          p85: confidence.p85,
          p95: confidence.p95,
        });
      } catch (e) {
        f.log.error(e);
        if (e instanceof TeamNotFoundError) {
          reply.code(404).send();
        }
        reply.code(500).send("something else went wrong");
      }
    },
  );
}
