import { TeamNotFoundError, getById } from "@app/common/repository";
import { Duration, intoThroughput } from "@app/throughput/api";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { showAsLineChart } from "./presentation";

export default async function (f: FastifyInstance) {
  f.get(
    "/",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      const id = request.params.id;

      try {
        const data = intoThroughput(getById(id)).count(Duration.byWeek);
        const chart = showAsLineChart(data);
        return reply.view("/templates/throughput/index.ejs", {
          dataSet: id,
          throughput: chart,
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
