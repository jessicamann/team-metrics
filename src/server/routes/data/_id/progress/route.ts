import { TeamNotFoundError, getById } from "@app/common/repository";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { showAsDonutChartsByFeature } from "./presentation";

export default async function (f: FastifyInstance) {
  f.get(
    "/",
    (
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
        const charts = showAsDonutChartsByFeature(getById(id), options);
        reply.view("/templates/progress/index.ejs", {
          dataSet: id,
          features: charts,
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
