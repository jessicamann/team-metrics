import { buildServer } from "./server";

(async () => {
  const server = buildServer();
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
