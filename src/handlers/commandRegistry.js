import { Collection } from 'discord.js';

/**
 * CommandRegistry manages the lifecycle and retrieval of all bot commands.
 * This provides an abstraction layer to facilitate dependency injection
 * and easier testing of command interactions.
 */
class CommandRegistry {
    constructor() {
        this.commands = new Collection();
    }

    /**
     * Registers a command instance.
     * @param {Object} command - The command definition object.
     */
    register(command) {
        if (!command.data || !command.execute) {
            throw new Error(`Invalid command structure for ${command.data?.name || 'unknown command'}`);
        }
        this.commands.set(command.data.name, command);
    }

    /**
     * Retrieves a command by name.
     * @param {string} name - The command name.
     * @returns {Object|undefined} The command definition.
     */
    get(name) {
        return this.commands.get(name);
    }

    /**
     * Retrieves all commands as an array.
     * @returns {Array} Array of commands.
     */
    getAll() {
        return Array.from(this.commands.values());
    }

    /**
     * Returns the size of the registry.
     * @returns {number}
     */
    get size() {
        return this.commands.size;
    }
}

export const commandRegistry = new CommandRegistry();
