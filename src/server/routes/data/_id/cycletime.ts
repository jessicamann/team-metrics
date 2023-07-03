import { TeamNotFoundError } from "@app/common/repository";
import { showAsScatterChart } from "@app/cycletime";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function (f: FastifyInstance) {
  f.get(
    "/cycletime",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      const id = request.params.id;

      try {
        const { chart, p50, p85, p95 } = await showAsScatterChart(id);
        return reply.view("/templates/cycletime/index.ejs", {
          dataSet: id,
          cycleTimeChart: chart,
          p95,
          p85,
          p50,
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
