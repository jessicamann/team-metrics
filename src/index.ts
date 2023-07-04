import { buildServer } from "./server";

const port = parseInt(process.env.PORT || "3000");

(async () => {
  const server = buildServer();
  try {
    await server.listen({ host: "0.0.0.0", port: port });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
