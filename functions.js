const dialogflow = require("@google-cloud/dialogflow");

module.exports = {
  dialogflowQuery: async function(message, query) {
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

  inform: function(client, message, answer) {
    client.users.cache
      .get("338649491894829057")
      .send(
        `**${message.author.username} in DM:** ${message}\n**Bot:** ${answer.response}\n${message.url}`
      );
  },
  mention: function(client, message, id) {
    client.users.cache
      .get(id)
      .send(`**${message.author.username}** | ${message.channel.name}: ${message.content}\n${message.url}`
      );
  },
  scrimScheduler: async function(client) {
    
    try{
    const guild = client.guilds.cache.get("387015404092129282");
      
    
    const scrims_at_1 = guild.roles.cache
      .get("715454691583983677")
      .members.map(m => " " + "`" + m.user.username + "`");
    const scrims_at_2 = guild.roles.cache
      .get("715454657811447839")
      .members.map(m => " " + "`" + m.user.username + "`");
    const scrims_at_3 = guild.roles.cache
      .get("715454626836643851")
      .members.map(m => " " + "`" + m.user.username + "`");
    const scrims_at_4 = guild.roles.cache
      .get("715447115022598257")
      .members.map(m => " " + "`" + m.user.username + "`");
    const scrims_at_5 = guild.roles.cache
      .get("715454271767707738")
      .members.map(m => " " + "`" + m.user.username + "`");
    const scrims_at_6 = guild.roles.cache
      .get("715454326440722433")
      .members.map(m => " " + "`" + m.user.username + "`");
    const scrims_at_7 = guild.roles.cache
      .get("715454356601962507")
      .members.map(m => " " + "`" + m.user.username + "`");
    const scrims_at_8 = guild.roles.cache
      .get("715454391586652213")
      .members.map(m => " " + "`" + m.user.username + "`");
    const scrims_at_9 = guild.roles.cache
      .get("715454462189371474")
      .members.map(m => " " + "`" + m.user.username + "`");
    const scrims_at_10 = guild.roles.cache
      .get("715454514882150420")
      .members.map(m => " " + "`" + m.user.username + "`");
    const scrims_at_11 = guild.roles.cache
      .get("715454560214188074")
      .members.map(m => " " + "`" + m.user.username + "`");
    const mixedScrimEdit = {
      embed: {
        color: 393032,
        title: "Mixed Scrims",
        description: "React with the time(s) you are available! (SUK/BST). Roles and reactions reset at night and might take a few seconds to show up/being removed. \n\nAccording roles can be used at the time when inviting starts but please don't spam them.",
        fields: [
          {
            name: `\n\u200b\n`,
            value: "<:1_:716919649207582762> \u200b "  + scrims_at_1 
          },
          {
            name: `\n\u200b\n`,
            value: "<:2_:716919649278885901> \u200b "  + scrims_at_2 
          },
          {
            name: `\n\u200b\n`,
            value: "<:3_:716919649446395924> \u200b "  + scrims_at_3 
          },
          {
            name: `\n\u200b\n`,
            value: "<:4_:715161638747111464> \u200b "  + scrims_at_4 
          },
          {
            name: `\n\u200b\n`,
            value: "<:5_:715161638860226603> \u200b "  + scrims_at_5 
          },
          {
            name: `\n\u200b\n`,
            value: "<:6_:633718531191603200> \u200b "  + scrims_at_6 
          },
          {
            name: `\n\u200b\n`,
            value: "<:7_:633718531279814692> \u200b "  + scrims_at_7 
          },
          {
            name: `\n\u200b\n`,
            value: "<:8_:633718531095265291> \u200b "  + scrims_at_8 
          },
          {
            name: `\n\u200b\n`,
            value: "<:9_:633718531061710849> \u200b "  + scrims_at_9 
          },
          {
            name: `\n\u200b\n`,
            value: "<:10:633718530860122123> \u200b "  + scrims_at_10
          },
          {
            name: `\n\u200b\n`,
            value: "<:11:633708690456707092> \u200b "  + scrims_at_11 
          }
        ]
      }
    };

    guild.channels.cache
      .get("715140086269739018")
      .messages.fetch("717453314132017264")
      .then(msg => msg.edit(mixedScrimEdit));
    }
    catch(error){}
  }
};
