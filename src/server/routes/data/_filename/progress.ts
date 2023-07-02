import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { existsSync } from "fs";
import { showAsDonutChartsByFeature } from "@app/progress";

export default async function (f: FastifyInstance) {
  f.get(
    "/progress",
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

      const options = request.query.features
        ? { only: request.query.features }
        : {};
      const charts = await showAsDonutChartsByFeature(filepath, options);
      return reply.view("/templates/progress/index.ejs", {
        dataSet: dataset,
        features: charts,
      });
    },
  );
}
