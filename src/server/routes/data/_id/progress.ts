import { TeamNotFoundError } from "@app/common/repository";
import { showAsDonutChartsByFeature } from "@app/progress";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function (f: FastifyInstance) {
  f.get(
    "/progress",
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Querystring: { features: "array" };
      }>,
      reply: FastifyReply,
    ) => {
      const id = request.params.id;

      const options = request.query.features
        ? { only: request.query.features }
        : {};

      try {
        const charts = await showAsDonutChartsByFeature(id, options);
        return reply.view("/templates/progress/index.ejs", {
          dataSet: id,
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
