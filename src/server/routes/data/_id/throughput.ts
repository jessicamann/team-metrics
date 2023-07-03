import { TeamNotFoundError } from "@app/common/repository";
import { showAsLineChart } from "@app/throughput";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function (f: FastifyInstance) {
  f.get(
    "/throughput",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      const id = request.params.id;

      try {
        const chart = await showAsLineChart(id);
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
