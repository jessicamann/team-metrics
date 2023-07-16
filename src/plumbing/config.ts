import { get } from "env-var";

const config = {
  port: () => get("PORT").default(3000).asPortNumber(),
};

export { config };
