/* eslint-disable multiline-ternary */
const { Listener } = require('discord-akairo');
const Logger = require('../../util/Logger');
const Raven = require('raven');

class CommandStartedListener extends Listener {
    constructor() {
        super('commandStarted', {
            event: 'commandStarted',
            emitter: 'commandHandler',
            category: 'commandHandler'
        });
    }

    async exec(message, command, args) {
        const tag = message.guild ? `${message.guild.name}/${message.author.tag}` : `${message.author.tag}`;
        Logger.log(`=> ${command.id}`, { tag });

        Raven.captureBreadcrumb({
            message: 'command_started',
            category: command.category.id,
            data: {
                user: {
                    id: message.author.id,
                    username: message.author.tag
                },
                guild: message.guild ? {
                    id: message.guild.id,
                    name: message.guild.name
                } : null,
                command: {
                    id: command.id,
                    aliases: command.aliases,
                    category: command.category.id
                },
                message: {
                    id: message.id,
                    content: message.content
                },
                args
            }
        });
        Raven.setContext({
            user: {
                id: message.author.id,
                username: message.author.tag
            },
            extra: {
                guild: message.guild ? {
                    id: message.guild.id,
                    name: message.guild.name
                } : null,
                command: {
                    id: command.id,
                    aliases: command.aliases,
                    category: command.category.id
                },
                message: {
                    id: message.id,
                    content: message.content
                },
                args
            }
        });
    }
}

module.exports = CommandStartedListener;