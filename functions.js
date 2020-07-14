const dialogflow = require("@google-cloud/dialogflow");
const Discord = require("discord.js");

module.exports = {
   DialogflowQuery: async function (message, query) {
        const config = {
        credentials: {
            private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
            client_email: process.env.CLIENT_EMAIL
        }
        };

        const sessionClient = new dialogflow.SessionsClient(config);
        const sessionPath = sessionClient.projectAgentSessionPath(
        process.env.PROJECT_ID,
        message.author.id
        );

        const request = {
        session: sessionPath,
        queryInput: {
            text: {
            text: query,
            languageCode: "en-US"
            }
        }
        };

        const result = await sessionClient.detectIntent(request);
        const intent = result[0].queryResult.intent.displayName;
        const response = result[0].queryResult.fulfillmentText;
        return { result, intent, response };
    },
    inform: function (client, answer, message) {
      if (message.guild === null) {
        const embed = new Discord.MessageEmbed()
          .setColor("#ff930f")
          .setAuthor(
            `${message.author.tag} in DM`,
            message.author.displayAvatarURL()
          )
          .setDescription(
            `**${message.author.username}:** ${message}\n**Bot:** ${answer.response}`
          );

        client.users.cache.get(process.env.OWNER).send(embed);
      } else {
        const embed = new Discord.MessageEmbed()
          .setColor("#ff930f")
          .setAuthor(
            `${message.author.tag} in ${message.channel.name}`,
            message.author.displayAvatarURL()
          )
          .setDescription(
            `**${message.author.username}:** [${message}](${message.url})\n**Bot:** ${answer.response}`
          );

        client.users.cache.get(process.env.OWNER).send(embed);
      }
    },
    error: function(client, error) {
        client.users.cache
        .get(process.env.OWNER)
        .send(">>> " + error.stack);
    },

    deletedMessage: async function (client, message) {
        const entry = await message.guild
            .fetchAuditLogs({ type: "MESSAGE_DELETE" })
            .then(audit => audit.entries.first());
        let user = "";
        try {
            if (
            entry.extra.channel.id === message.channel.id &&
            entry.target.id === message.author.id &&
            entry.createdTimestamp > Date.now() - 5000 &&
            entry.extra.count >= 1
            ) {
            user = entry.executor.username;
            } else {
            user = message.author.username;
            }

        const embed = new Discord.MessageEmbed()
        .setColor('#c20000')
        .setAuthor( `${user} deleted a message from ${message.author.username} in #${message.channel.name}`, user.displayAvatarURL())
        .setDescription(`${message.content}`)

        client.channels.cache.get("718176504437276682").send(embed);
        }
        catch (e) 
        {client.users.cache
        .get(process.env.OWNER)
        .send("Sorry could not fetch the deleted message")}
    },

    mention: function(client, message, id) {
        const embed = new Discord.MessageEmbed()
        .setColor('#00c22a')
        .setAuthor(`${message.author.username} mentioned you in ${message.channel.name}`, message.author.displayAvatarURL())
        .setDescription(`${message} \n [Link](${message.url})`)

        client.users.cache
        .get(id)
        .send(embed);
    }
};
