import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { existsSync } from "fs";
import { showAsLineChart } from "@app/throughput";

export default async function (f: FastifyInstance) {
  f.get(
    "/throughput",
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

      const chart = await showAsLineChart(filepath);
      return reply.view("/templates/throughput/index.ejs", {
        dataSet: dataset,
        throughput: chart,
      });
    },
  );
}
