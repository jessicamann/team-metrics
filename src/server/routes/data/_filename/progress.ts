import { TeamNotFoundError } from "@app/common/repository";
import { showAsDonutChartsByFeature } from "@app/progress";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

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

      const options = request.query.features
        ? { only: request.query.features }
        : {};

      try {
        const charts = await showAsDonutChartsByFeature(dataset, options);
        return reply.view("/templates/progress/index.ejs", {
          dataSet: dataset,
          features: charts,
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
