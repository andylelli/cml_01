import { jobRegistry } from "./jobs/index.js";
export const startWorker = async () => {
    console.log("@cml/worker runner started");
    const jobNames = Object.keys(jobRegistry);
    console.log(`@cml/worker jobs available: ${jobNames.join(", ")}`);
};
//# sourceMappingURL=runner.js.map