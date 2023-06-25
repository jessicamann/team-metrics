import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { existsSync } from "fs";
import { toScatterChart } from "../../../../cycletime/chart";

export default async function (f: FastifyInstance) {
  f.get(
    "/cycletime",
    async (
      request: FastifyRequest<{ Params: { filename: string } }>,
      reply: FastifyReply,
    ) => {
      const dataset = request.params.filename;
      const filename = `${dataset}.csv`;
      const filepath = `./uploads/${filename}`;

      if (!existsSync(filepath)) {
        return reply.code(404).send();
      }

      const { chart, p50, p85, p95 } = await toScatterChart(filepath);
      return reply.view("/templates/cycletime.ejs", {
        dataSet: dataset,
        cycleTimeChart: chart,
        p95,
        p85,
        p50,
      });
    },
  );
}
