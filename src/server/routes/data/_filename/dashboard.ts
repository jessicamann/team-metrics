import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { existsSync } from "fs";
import { cycletimesSummary } from "../../../../dashboard/cycletime";
import { forecastSummary } from "../../../../dashboard/forecast";

export default async function (f: FastifyInstance) {
  f.get(
    "/dashboard",
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

      const { outliers, p25, p75, p85 } = await cycletimesSummary(filepath);
      const summary = await forecastSummary(filepath);

      return reply.view("/templates/dashboard/index.ejs", {
        dataSet: dataset,
        cycleTimeData: {
          threshold: {
            text: "85%",
            value: p85,
          },
        },
        outliers: {
          threshold: {
            text: "85th",
            value: p85,
          },
          items: outliers,
        },
        consistency: {
          p25,
          p75,
        },
        forecastedProgress: summary,
      });
    },
  );
}
