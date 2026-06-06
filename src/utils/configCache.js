/**
 * Simple in-memory cache with TTL (Time To Live).
 */
class ConfigCache {
    constructor(ttlMs = 300000) { // Default 5 minutes
        this.cache = new Map();
        this.ttlMs = ttlMs;
    }

    set(guildId, config) {
        this.cache.set(guildId, {
            config,
            expiresAt: Date.now() + this.ttlMs
        });
    }

    get(guildId) {
        const cached = this.cache.get(guildId);
        if (!cached) return null;

        if (Date.now() > cached.expiresAt) {
            this.cache.delete(guildId);
            return null;
        }

        return cached.config;
    }

    delete(guildId) {
        this.cache.delete(guildId);
    }
}

export const configCache = new ConfigCache();
