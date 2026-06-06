import { getGuildConfig as getGuildConfigDb, setGuildConfig as setGuildConfigDb } from '../utils/database.js';
import { BotConfig } from '../config/bot.js';
import { normalizeGuildConfig, validateGuildConfigOrThrow } from '../utils/schemas.js';
import { wrapServiceBoundary } from '../utils/serviceErrorBoundary.js';
import { configCache } from '../utils/configCache.js';

const GUILD_CONFIG_DEFAULTS = {
    prefix: BotConfig.prefix,
    modRole: null,
    adminRole: null,
    logChannelId: null,
    welcomeChannel: null,
    welcomeMessage: 'Welcome {user} to {server}!',
    autoRole: null,
    dmOnClose: true,
    logIgnore: { users: [], channels: [] },
    logging: {
        enabled: false,
        channelId: null,
        enabledEvents: {}
    }
};

export const getGuildConfig = wrapServiceBoundary(async function getGuildConfig(client, guildId, context = {}) {
    const cached = configCache.get(guildId);
    if (cached) return cached;

    const config = await getGuildConfigDb(client, guildId, context);
    const normalized = normalizeGuildConfig(config, GUILD_CONFIG_DEFAULTS);

    configCache.set(guildId, normalized);
    return normalized;
}, {
    service: 'guildConfigService',
    operation: 'getGuildConfig',
    message: 'Failed to fetch guild configuration',
    userMessage: 'Failed to load server configuration. Please try again.'
});

export const setGuildConfig = wrapServiceBoundary(async function setGuildConfig(client, guildId, config, context = {}) {
    const normalized = normalizeGuildConfig(config, GUILD_CONFIG_DEFAULTS);
    const validated = validateGuildConfigOrThrow(normalized, { guildId, ...context });
    const result = await setGuildConfigDb(client, guildId, validated, context);

    configCache.set(guildId, validated);
    return result;
}, {
    service: 'guildConfigService',
    operation: 'setGuildConfig',
    message: 'Failed to save guild configuration',
    userMessage: 'Failed to save server configuration. Please try again.'
});

export const updateGuildConfig = wrapServiceBoundary(async function updateGuildConfig(client, guildId, updates, context = {}) {
    const currentConfig = await getGuildConfig(client, guildId, context);
    const newConfig = { ...currentConfig, ...updates };
    const normalized = normalizeGuildConfig(newConfig, GUILD_CONFIG_DEFAULTS);
    const validated = validateGuildConfigOrThrow(normalized, { guildId, ...context });
    const result = await setGuildConfigDb(client, guildId, validated, context);

    configCache.set(guildId, validated);
    return result;
}, {
    service: 'guildConfigService',
    operation: 'updateGuildConfig',
    message: 'Failed to update guild configuration',
    userMessage: 'Failed to update server configuration. Please try again.'
});










export const getConfigValue = wrapServiceBoundary(async function getConfigValue(client, guildId, key, defaultValue = null, context = {}) {
    const config = await getGuildConfig(client, guildId, context);
    return config[key] !== undefined ? config[key] : defaultValue;
}, {
    service: 'guildConfigService',
    operation: 'getConfigValue',
    message: 'Failed to read guild configuration value',
    userMessage: 'Failed to read a server setting. Please try again.'
});









export const setConfigValue = wrapServiceBoundary(async function setConfigValue(client, guildId, key, value, context = {}) {
    return await updateGuildConfig(client, guildId, { [key]: value }, context);
}, {
    service: 'guildConfigService',
    operation: 'setConfigValue',
    message: 'Failed to update guild configuration value',
    userMessage: 'Failed to update a server setting. Please try again.'
});


