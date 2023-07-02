import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { existsSync } from "fs";
import { showAsCalendar } from "@app/forecasting";

export default async function (f: FastifyInstance) {
  f.get(
    "/forecast",
    async (
      request: FastifyRequest<{
        Params: { filename: string };
        Querystring: { features: "array" };
      }>,
      reply: FastifyReply,
    ) => {
      const dataset = request.params.filename;
      const filename = `${dataset}.csv`;
      const filepath = `./uploads/${filename}`;

      if (!existsSync(filepath)) {
        return reply.code(404).send();
      }

      const result = await showAsCalendar(filepath);

      return reply.view("/templates/forecasts/index.ejs", {
        dataSet: dataset,
        remainingStories: result.remainingStories,
        calendarData: result.calendarData,
        p50: result.p50,
        p85: result.p85,
        p95: result.p95,
      });
    },
  );
}
