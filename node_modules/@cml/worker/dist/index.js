import { startWorker } from "./runner.js";
startWorker().catch((error) => {
    console.error("@cml/worker failed to start", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map