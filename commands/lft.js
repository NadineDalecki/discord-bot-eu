module.exports = {
    name: 'lft',
    execute(message, args, client) {
        const guild = client.guilds.cache.get("387015404092129282");
        const names = guild.roles.cache
            .get("549925842646597651")
            .members.map(m => m.user.tag);
         message.channel.send(names)
    }
}
