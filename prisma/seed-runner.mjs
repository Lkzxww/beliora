import "dotenv/config";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, {
  tsconfigPaths: "apps/web/tsconfig.json",
});

await jiti.import("./seed.ts");
