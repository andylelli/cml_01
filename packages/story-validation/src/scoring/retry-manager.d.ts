/**
 * Configuration for a single agent's retry behavior
 */
export interface RetryConfig {
    max_retries: number;
    backoff_strategy: 'exponential' | 'linear' | 'none';
    backoff_delay_ms: number;
    reason?: string;
}
/**
 * Global retry configuration
 */
export interface GlobalRetryConfig {
    max_total_retries: number;
    enhanced_feedback: boolean;
    log_retries: boolean;
    abort_on_max_retries: boolean;
}
/**
 * Complete retry limits configuration from YAML
 */
export interface RetryLimitsConfig {
    retry_limits: Record<string, RetryConfig>;
    global: GlobalRetryConfig;
}
/**
 * History entry for a single retry attempt
 */
export interface RetryHistoryEntry {
    attempt: number;
    timestamp: Date;
    reason: string;
    score_before?: number;
    backoff_ms?: number;
}
/**
 * Manages retry logic for failed generation phases
 * Loads configuration from retry-limits.yaml and tracks retry attempts
 */
export declare class RetryManager {
    private config;
    private retryCounts;
    private totalRetries;
    private retryHistory;
    constructor(configPath?: string);
    /**
     * Load retry configuration from YAML file
     */
    private loadConfig;
    /**
     * Fallback default configuration if YAML cannot be loaded
     */
    private getDefaultConfig;
    /**
     * Check if a phase can be retried
     * Returns false if either the phase limit or global limit is exceeded
     */
    canRetry(agent: string): boolean;
    /**
     * Record a retry attempt for a phase
     * @param agent - Agent identifier (e.g., 'agent4-hard-logic')
     * @param reason - Why the retry is being attempted
     * @param scoreBefore - The score that triggered the retry
     */
    recordRetry(agent: string, reason: string, scoreBefore?: number): void;
    /**
     * Get the backoff delay for the next retry of a phase
     * Calculates based on strategy (exponential, linear, none)
     */
    getBackoffDelay(agent: string): number;
    /**
     * Get retry statistics for reporting
     */
    getRetryStats(): {
        total_retries: number;
        phases_retried: number;
        retry_rate: string;
        retried_phases: {
            agent: string;
            retry_count: number;
            max_retries: number;
        }[];
    };
    /**
     * Get retry history for a specific agent
     */
    getRetryHistory(agent: string): RetryHistoryEntry[];
    /**
     * Get current retry count for an agent
     */
    getRetryCount(agent: string): number;
    /**
     * Get maximum retry limit for an agent
     */
    getMaxRetries(agent: string): number;
    /**
     * Check if enhanced feedback should be provided on retry
     */
    shouldProvideEnhancedFeedback(): boolean;
    /**
     * Check if generation should be aborted when a phase exceeds max retries
     * Reads abort_on_max_retries from the global config section
     */
    shouldAbortOnMaxRetries(): boolean;
    /**
     * Reset retry tracking (for new generation attempt)
     */
    reset(): void;
    /**
     * Get the complete configuration
     */
    getConfig(): RetryLimitsConfig;
}
