import csv from "csvtojson";
import { MultipartFile } from "@fastify/multipart";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { existsSync, writeFileSync } from "fs";

export default async function (f: FastifyInstance) {
  f.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const { file, filename } = (await request.file()) as MultipartFile;
    const trimmedFileName = filename.replace(".csv", "");

    const asJson = (await csv().fromStream(file)) as any[];
    writeFileSync(
      `./uploads/${filename.replace(".csv", ".json")}`,
      JSON.stringify(asJson),
    );

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
      if (existsSync(`./uploads/${filename}.json`)) {
        reply.view("/templates/team/index.ejs", { dataSet: filename });
      } else {
        reply.code(404).send();
      }
    },
  );
}
