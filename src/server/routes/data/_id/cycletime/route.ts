import { TeamNotFoundError, getById } from "@app/common/repository";
import { toCycleTime } from "@app/cycletime/api";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { showAsScatterChart } from "./presentation";

export default async function (f: FastifyInstance) {
  f.get(
    "/",
    (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      const id = request.params.id;

      try {
        const data = toCycleTime(getById(id));
        const { chart, p50, p85, p95 } = showAsScatterChart(data);
        reply.view("/templates/cycletime/index.ejs", {
          dataSet: id,
          cycleTimeChart: chart,
          p95,
          p85,
          p50,
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
