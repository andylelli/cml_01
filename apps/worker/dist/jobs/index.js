// Export orchestrator functions
export { generateMystery, generateMysterySimple, } from "./mystery-orchestrator.js";
const notImplemented = (name) => {
    return async () => {
        console.log(`@cml/worker ${name} placeholder`);
    };
};
export const jobRegistry = {
    settingJob: notImplemented("settingJob"),
    castJob: notImplemented("castJob"),
    cmlJob: notImplemented("cmlJob"),
    validateCmlJob: notImplemented("validateCmlJob"),
    cluesJob: notImplemented("cluesJob"),
    outlineJob: notImplemented("outlineJob"),
    proseJob: notImplemented("proseJob"),
    gamePackJob: notImplemented("gamePackJob"),
    fullPipelineJob: notImplemented("fullPipelineJob"),
};
//# sourceMappingURL=index.js.map