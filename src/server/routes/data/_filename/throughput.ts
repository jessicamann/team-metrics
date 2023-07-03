import { TeamNotFoundError } from "@app/common/repository";
import { showAsLineChart } from "@app/throughput";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function (f: FastifyInstance) {
  f.get(
    "/throughput",
    async (
      request: FastifyRequest<{ Params: { filename: string } }>,
      reply: FastifyReply,
    ) => {
      const dataset = request.params.filename;

      try {
        const chart = await showAsLineChart(dataset);
        return reply.view("/templates/throughput/index.ejs", {
          dataSet: dataset,
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
