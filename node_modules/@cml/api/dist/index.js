import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "./server.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../../..", ".env.local") });
const port = Number(process.env.PORT || 3005);
const app = createServer();
app.listen(port, "0.0.0.0", () => {
    console.log(`@cml/api listening on 0.0.0.0:${port}`);
});
//# sourceMappingURL=index.js.map