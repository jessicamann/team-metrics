import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { cycletimesSummary, forecastSummary } from "@app/dashboard";
import { TeamNotFoundError } from "@app/common/repository";

export default async function (f: FastifyInstance) {
  f.get(
    "/dashboard",
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Querystring: { features: "array" };
      }>,
      reply: FastifyReply,
    ) => {
      const id = request.params.id;

      try {
        const [{ outliers, p25, p75, p85 }, summary] = await Promise.all([
          cycletimesSummary(id),
          forecastSummary(id, { onlyRecent: true }),
        ]);

        return reply.view("/templates/dashboard/index.ejs", {
          dataSet: id,
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
