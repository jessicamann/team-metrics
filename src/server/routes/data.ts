import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createWriteStream, writeFileSync } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";

export default async function (f: FastifyInstance) {
  f.post("/data", async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await request.file();

    const file = data!.file;
    const filename = data!.filename || "";
    const pump = promisify(pipeline);
    await pump(file, createWriteStream(`./uploads/${filename}`));

    reply.code(201).send();
  });
}
