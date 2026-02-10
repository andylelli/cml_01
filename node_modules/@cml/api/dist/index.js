import { createServer } from "./server.js";
const port = Number(process.env.PORT || 3005);
const app = createServer();
app.listen(port, "0.0.0.0", () => {
    console.log(`@cml/api listening on 0.0.0.0:${port}`);
});
//# sourceMappingURL=index.js.map