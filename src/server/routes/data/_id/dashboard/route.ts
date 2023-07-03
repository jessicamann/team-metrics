import { TeamNotFoundError, getById } from "@app/common/repository";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { dashboardSummaries } from "./presentation";

export default async function (f: FastifyInstance) {
  f.get(
    "/",
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Querystring: { features: "array" };
      }>,
      reply: FastifyReply,
    ) => {
      const id = request.params.id;

      try {
        const {
          outliers,
          forecast,
          cycletime: { p25, p75, p85 },
        } = dashboardSummaries(getById(id), { onlyRecent: true });

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
          forecastedProgress: forecast,
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
