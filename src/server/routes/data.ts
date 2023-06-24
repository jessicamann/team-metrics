import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createWriteStream, existsSync } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";

export default async function (f: FastifyInstance) {
  f.post("/data", async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await request.file();

    const file = data!.file;
    const filename = data!.filename || "";
    const pump = promisify(pipeline);
    await pump(file, createWriteStream(`./uploads/${filename}`));

    const trimmedFileName = filename.replace(".csv", "");
    reply.code(303).header("location", `/data/${trimmedFileName}`).send();
  });

  f.get(
    "/data/:filename",
    (
      request: FastifyRequest<{ Params: { filename: string } }>,
      reply: FastifyReply,
    ) => {
      if (existsSync(`./uploads/${request.params.filename}.csv`)) {
        reply.view("/templates/team.ejs", { dataSet: {} });
      } else {
        reply.code(404).send();
      }
    },
  );
}
