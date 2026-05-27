const {
    Client,
    GatewayIntentBits
} = require('discord.js');

const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`${client.user.tag} est connecté !`);
});

client.on('guildMemberAdd', async (member) => {

    for (const channelId of config.welcomeChannels) {

        const channel = member.guild.channels.cache.get(channelId);

        if (!channel) continue;

        const welcomeMessage = config.message.replace(
            '{user}',
            `<@${member.id}>`
        );

        try {

            const sentMessage = await channel.send({
                content: welcomeMessage
            });

            setTimeout(async () => {
                try {
                    await sentMessage.delete();
                } catch (err) {
                    console.log('Impossible de supprimer le message');
                }
            }, config.deleteAfter);

        } catch (err) {
            console.error(err);
        }
    }
});

client.login(config.token);
