import { config } from "./plumbing/config";
import { buildServer } from "./server";

(async () => {
  const server = buildServer();
  try {
    await server.listen({ host: "0.0.0.0", port: config.port() });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
