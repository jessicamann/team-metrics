import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createWriteStream, existsSync } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { toScatterChart } from "../../cycletime/chart";
import { toWeeklyThroughput } from "../../throughput/chart";
import { toProgressCharts } from "../../progress/chart";

export default async function (f: FastifyInstance) {
  f.post("/data", async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await request.file();

    const file = data!.file;
    const filename = data!.filename || "";
    const pump = promisify(pipeline);
    await pump(file, createWriteStream(`./uploads/${filename}`));

    const trimmedFileName = filename.replace(".csv", "");
    return reply
      .code(303)
      .header("location", `/data/${trimmedFileName}`)
      .send();
  });

  f.get(
    "/data/:filename",
    (
      request: FastifyRequest<{ Params: { filename: string } }>,
      reply: FastifyReply,
    ) => {
      const filename = request.params.filename;
      if (existsSync(`./uploads/${filename}.csv`)) {
        reply.view("/templates/team.ejs", { dataSet: filename });
      } else {
        reply.code(404).send();
      }
    },
  );

  f.get(
    "/data/:filename/cycletime",
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

  f.get(
    "/data/:filename/throughput",
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

      const chart = await toWeeklyThroughput(filepath);
      return reply.view("/templates/throughput.ejs", {
        dataSet: dataset,
        throughput: chart,
      });
    },
  );

  f.get(
    "/data/:filename/progress",
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
      console.log(JSON.stringify(options));
      const charts = await toProgressCharts(filepath, options);
      return reply.view("/templates/progress.ejs", {
        dataSet: dataset,
        features: charts,
      });
    },
  );
}
