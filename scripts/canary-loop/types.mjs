/**
 * @typedef {Object} LoopRequest
 * @property {string} runId
 * @property {string} agent
 * @property {string=} startFromAgent
 * @property {boolean=} hydratePriorFromRun
 * @property {"suggest"|"apply"} mode
 * @property {number} maxIterations
 * @property {number} maxUnchanged
 * @property {"targeted"|"full"} testScope
 * @property {string=} canaryCommand
 * @property {boolean} stopOnNewFailureClass
 * @property {string[]=} allowFiles
 * @property {string[]=} denyFiles
 * @property {string=} resume
 * @property {number=} overrideFileCap
 * @property {number=} startChapter
 * @property {boolean=} confirmSharedEdits
 * @property {boolean=} partialRollbackEnabled
 * @property {boolean=} enableMajorRework
 * @property {boolean=} majorReworkAgentV2
 * @property {{
 *   enabledByDefault?: boolean,
 *   maxInputTokens?: number,
 *   maxOutputTokens?: number,
 *   maxThinkTokensPerWave?: number,
 *   maxActTokensPerWave?: number,
 *   maxCampaignTokens?: number,
 *   minRemainingPercentForBroadWork?: number,
 *   maxFilesPerWave?: number,
 *   maxPhaseRetries?: { P1?: number, P2?: number, P3?: number },
 *   enforceNarrativeAcceptanceGates?: boolean,
 * }=} majorReworkConfig
 */

/**
 * @typedef {Object} FailureSignature
 * @property {string} signatureId
 * @property {string} agent
 * @property {string} stage
 * @property {string} class
 * @property {"critical"|"warning"} severity
 * @property {number} confidence
 * @property {"error"|"warning"} kind
 * @property {string} message
 * @property {Array<{ file: string, line?: number, snippet?: string }>} evidence
 * @property {string[]} rawMarkers
 * @property {string} validator
 */

export {};
