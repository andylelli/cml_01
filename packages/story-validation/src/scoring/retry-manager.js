import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
/**
 * Manages retry logic for failed generation phases
 * Loads configuration from retry-limits.yaml and tracks retry attempts
 */
export class RetryManager {
    config;
    retryCounts = new Map();
    totalRetries = 0;
    retryHistory = new Map();
    constructor(configPath) {
        this.config = this.loadConfig(configPath);
    }
    /**
     * Load retry configuration from YAML file
     */
    loadConfig(configPath) {
        const defaultPath = path.join(process.cwd(), 'apps', 'worker', 'config', 'retry-limits.yaml');
        const yamlPath = configPath || defaultPath;
        try {
            const fileContents = fs.readFileSync(yamlPath, 'utf8');
            const config = yaml.load(fileContents);
            return config;
        }
        catch (error) {
            console.warn(`Failed to load retry config from ${yamlPath}, using defaults`, error);
            return this.getDefaultConfig();
        }
    }
    /**
     * Fallback default configuration if YAML cannot be loaded
     */
    getDefaultConfig() {
        return {
            retry_limits: {
                'agent1-background': {
                    max_retries: 2,
                    backoff_strategy: 'exponential',
                    backoff_delay_ms: 1000,
                },
                'agent2-cast': {
                    max_retries: 3,
                    backoff_strategy: 'linear',
                    backoff_delay_ms: 500,
                },
                'agent3-character-profiles': {
                    max_retries: 3,
                    backoff_strategy: 'linear',
                    backoff_delay_ms: 500,
                },
                'agent4-hard-logic': {
                    max_retries: 4,
                    backoff_strategy: 'exponential',
                    backoff_delay_ms: 2000,
                },
                'agent5-location-profiles': {
                    max_retries: 3,
                    backoff_strategy: 'linear',
                    backoff_delay_ms: 500,
                },
                'agent6-temporal-context': {
                    max_retries: 2,
                    backoff_strategy: 'none',
                    backoff_delay_ms: 0,
                },
                'agent7-narrative': {
                    max_retries: 3,
                    backoff_strategy: 'exponential',
                    backoff_delay_ms: 1000,
                },
                'agent8-setting-refinement': {
                    max_retries: 3,
                    backoff_strategy: 'linear',
                    backoff_delay_ms: 500,
                },
                'agent9-prose': {
                    max_retries: 2,
                    backoff_strategy: 'exponential',
                    backoff_delay_ms: 3000,
                },
            },
            global: {
                max_total_retries: 15,
                enhanced_feedback: true,
                log_retries: true,
                abort_on_max_retries: true,
            },
        };
    }
    /**
     * Check if a phase can be retried
     * Returns false if either the phase limit or global limit is exceeded
     */
    canRetry(agent) {
        const agentRetries = this.retryCounts.get(agent) || 0;
        const agentConfig = this.config.retry_limits[agent];
        if (!agentConfig) {
            console.warn(`No retry config found for agent: ${agent}`);
            return false;
        }
        // Check phase-specific limit
        if (agentRetries >= agentConfig.max_retries) {
            return false;
        }
        // Check global limit
        if (this.totalRetries >= this.config.global.max_total_retries) {
            return false;
        }
        return true;
    }
    /**
     * Record a retry attempt for a phase
     * @param agent - Agent identifier (e.g., 'agent4-hard-logic')
     * @param reason - Why the retry is being attempted
     * @param scoreBefore - The score that triggered the retry
     */
    recordRetry(agent, reason, scoreBefore) {
        const currentCount = this.retryCounts.get(agent) || 0;
        this.retryCounts.set(agent, currentCount + 1);
        this.totalRetries++;
        // Add to history
        const history = this.retryHistory.get(agent) || [];
        const backoffMs = this.getBackoffDelay(agent);
        history.push({
            attempt: currentCount + 1,
            timestamp: new Date(),
            reason,
            score_before: scoreBefore,
            backoff_ms: backoffMs,
        });
        this.retryHistory.set(agent, history);
        if (this.config.global.log_retries) {
            console.log(`[RetryManager] Retry ${currentCount + 1}/${this.config.retry_limits[agent]?.max_retries} for ${agent}: ${reason} (score: ${scoreBefore || 'N/A'})`);
        }
    }
    /**
     * Get the backoff delay for the next retry of a phase
     * Calculates based on strategy (exponential, linear, none)
     */
    getBackoffDelay(agent) {
        const agentConfig = this.config.retry_limits[agent];
        if (!agentConfig) {
            return 0;
        }
        const retryCount = this.retryCounts.get(agent) || 0;
        const baseDelay = agentConfig.backoff_delay_ms;
        switch (agentConfig.backoff_strategy) {
            case 'exponential':
                return baseDelay * Math.pow(2, retryCount);
            case 'linear':
                return baseDelay * (retryCount + 1);
            case 'none':
                return 0;
            default:
                return baseDelay;
        }
    }
    /**
     * Get retry statistics for reporting
     */
    getRetryStats() {
        const retried_phases = Array.from(this.retryCounts.entries()).map(([agent, count]) => ({
            agent,
            retry_count: count,
            max_retries: this.config.retry_limits[agent]?.max_retries || 0,
        }));
        return {
            total_retries: this.totalRetries,
            phases_retried: this.retryCounts.size,
            retry_rate: this.retryCounts.size > 0
                ? (this.totalRetries / this.retryCounts.size).toFixed(2)
                : '0.00',
            retried_phases,
        };
    }
    /**
     * Get retry history for a specific agent
     */
    getRetryHistory(agent) {
        return this.retryHistory.get(agent) || [];
    }
    /**
     * Get current retry count for an agent
     */
    getRetryCount(agent) {
        return this.retryCounts.get(agent) || 0;
    }
    /**
     * Get maximum retry limit for an agent
     */
    getMaxRetries(agent) {
        return this.config.retry_limits[agent]?.max_retries || 0;
    }
    /**
     * Check if enhanced feedback should be provided on retry
     */
    shouldProvideEnhancedFeedback() {
        return this.config.global.enhanced_feedback;
    }
    /**
     * Check if generation should be aborted when a phase exceeds max retries
     * Reads abort_on_max_retries from the global config section
     */
    shouldAbortOnMaxRetries() {
        return this.config.global.abort_on_max_retries;
    }
    /**
     * Reset retry tracking (for new generation attempt)
     */
    reset() {
        this.retryCounts.clear();
        this.totalRetries = 0;
        this.retryHistory.clear();
    }
    /**
     * Get the complete configuration
     */
    getConfig() {
        return this.config;
    }
}
//# sourceMappingURL=retry-manager.js.map