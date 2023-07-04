import { buildServer } from "./server";

const port = parseInt(process.env.PORT || "3000");

(async () => {
  const server = buildServer();
  try {
    await server.listen({ port: port });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
