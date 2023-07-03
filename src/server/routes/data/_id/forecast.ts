import { TeamNotFoundError } from "@app/common/repository";
import { showAsCalendar } from "@app/forecasting";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function (f: FastifyInstance) {
  f.get(
    "/forecast",
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Querystring: { features: "array" };
      }>,
      reply: FastifyReply,
    ) => {
      const id = request.params.id;

      try {
        const result = await showAsCalendar(id);
        return reply.view("/templates/forecasts/index.ejs", {
          dataSet: id,
          remainingStories: result.remainingStories,
          calendarData: result.calendarData,
          p50: result.p50,
          p85: result.p85,
          p95: result.p95,
        });
      } catch (e) {
        f.log.error(e);
        if (e instanceof TeamNotFoundError) {
          return reply.code(404).send();
        }
        return reply.code(500).send("something else went wrong");
      }
    },
  );
}