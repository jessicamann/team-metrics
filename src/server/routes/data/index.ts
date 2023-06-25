import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createWriteStream, existsSync } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";

export default async function (f: FastifyInstance) {
  f.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
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
    "/:filename",
    (
      request: FastifyRequest<{ Params: { filename: string } }>,
      reply: FastifyReply,
    ) => {
      const filename = request.params.filename;
      if (existsSync(`./uploads/${filename}.csv`)) {
        reply.view("/templates/team/index.ejs", { dataSet: filename });
      } else {
        reply.code(404).send();
      }
    },
  );
}