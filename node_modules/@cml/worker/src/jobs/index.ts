export type JobName =
  | "settingJob"
  | "castJob"
  | "cmlJob"
  | "validateCmlJob"
  | "cluesJob"
  | "outlineJob"
  | "proseJob"
  | "gamePackJob";

export type JobContext = {
  runId?: string;
  projectId?: string;
};

export type JobHandler = (context: JobContext) => Promise<void>;

const notImplemented = (name: JobName): JobHandler => {
  return async () => {
    console.log(`@cml/worker ${name} placeholder`);
  };
};

export const jobRegistry: Record<JobName, JobHandler> = {
  settingJob: notImplemented("settingJob"),
  castJob: notImplemented("castJob"),
  cmlJob: notImplemented("cmlJob"),
  validateCmlJob: notImplemented("validateCmlJob"),
  cluesJob: notImplemented("cluesJob"),
  outlineJob: notImplemented("outlineJob"),
  proseJob: notImplemented("proseJob"),
  gamePackJob: notImplemented("gamePackJob"),
};
