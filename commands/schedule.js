const Attachment = require("discord.js").Attachment;
module.exports = {
  name: "schedule",
  execute(message, client) {
    message.delete().catch(_ => {});
    if (message.member.hasPermission("ADMINISTRATOR")) {
      const mixedScrim = {
        embed: {
          color: 393032,
          title: "Mixed Scrims",
          description:
            "React with the time you are available! (SUK/BST) \n\nTip: By right clicking near the bots name of this message or on the three dots you can view all reactions and can contact those who are availabe at the same time!"
        }
      };
      message.channel.send(mixedScrim).then(async msg => {
        await msg.react("716919649207582762"); //1
        await msg.react("716919649278885901"); //2
        await msg.react("716919649446395924"); //3
        await msg.react("715161638747111464"); //4
        await msg.react("715161638860226603"); //5
        await msg.react("633718531191603200"); //6
        await msg.react("633718531279814692"); //7
        await msg.react("633718531095265291"); //8
        await msg.react("633718531061710849"); //9
        await msg.react("633718530860122123"); //10
        await msg.react("633708690456707092"); //11
      });
    }
  }
};
