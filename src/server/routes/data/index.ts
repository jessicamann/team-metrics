import { existsById, save } from "@app/common/repository";
import { MultipartFile } from "@fastify/multipart";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function (f: FastifyInstance) {
  f.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const { file } = (await request.file()) as MultipartFile;

    const id = await save(file);
    return reply.code(303).header("location", `/data/${id}`).send();
  });

  f.get(
    "/:id",
    (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      const id = request.params.id;
      existsById(id)
        ? reply.view("/templates/team/index.ejs", { dataSet: id })
        : reply.code(404).send();
    },
  );
}
