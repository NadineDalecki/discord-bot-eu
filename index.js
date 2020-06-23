/*╔══════════════════════════════════════╗
    Express
  ╚═══════════════════════════════════════╝*/
const http = require("http"),
  express = require("express"),
  app = express();

app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
/*╔═══════════════════════════════════════╗
    const
  ╚═══════════════════════════════════════╝*/
const Discord = require("discord.js"),
  client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] }),
  fs = require("fs"),
  fetch = require("node-fetch"),
  roleList = require("./info/roles.js"),
  text = require("./info/text.js"),
  functions = require("./functions.js"),
  dialogflow = require("@google-cloud/dialogflow"),
  schedule = require("node-schedule"),
  emojiList = require("./info/reaction-roles.json"),
  prefix = "!";
/*╔═══════════════════════════════════════╗
    Errors
  ╚═══════════════════════════════════════╝*/
process.on("error", error =>
  client.users.cache
    .get("338649491894829057")
    .send("This is an error event:" + error.stack)
);
client.on("error", error =>
  client.users.cache
    .get("338649491894829057")
    .send("This is an error event:" + error.stack)
);
process.on("uncaughtException", error =>
  client.users.cache
    .get("338649491894829057")
    .send("This is an error event:" + error.stack)
);
process.on("unhandledRejection", error =>
  client.users.cache
    .get("338649491894829057")
    .send("This is an error event:" + error.stack)
);

/*╔═══════════════════════════════════════╗
    Bot
  ╚═══════════════════════════════════════╝*/
client.once("ready", () => {
  client.user.setActivity("Echo Community", {
    url: "https://www.twitch.tv/echocommunity",
    type: "STREAMING"
  });

  console.log("Ready!");
});
client.on("guildMemberAdd", member => {
  setTimeout(function() {
    member.send(text.Welcome1);
    member.send(text.Welcome2);
  }, 3000);
});

const updateScheduleMessage = schedule.scheduleJob("*/5 * * * * *", function() {
  functions.scrimScheduler(client);
});

/*╔═══════════════════════════════════════╗
    Schedules
  ╚═══════════════════════════════════════╝*/
const reaction_refresh = schedule.scheduleJob(
  { hour: 2, minute: 0, dayOfWeek: [0, new schedule.Range(0, 6)] },
  function() {
    const guild = client.guilds.cache.get("387015404092129282");
    guild.channels.cache
      .get("715140086269739018")
      .messages.fetch("717453314132017264")
      .then(msg =>
        msg.reactions
          .removeAll()
          .then(async msg => {
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
          })
          .catch(error =>
            functions.mention(client, error, "717320158460510279")
          )
      );

    guild.members.cache.map(member => {
      member.roles.remove([
        "715454691583983677",
        "715454657811447839",
        "715454626836643851",
        "715447115022598257",
        "715454271767707738",
        "715454326440722433",
        "715454356601962507",
        "715454391586652213",
        "715454462189371474",
        "715454514882150420",
        "715454560214188074"
      ]);
    });
  }
);

/*╔═══════════════════════════════════════╗
    Reactions
  ╚═══════════════════════════════════════╝*/
client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      functions.mention(client, error, "717320158460510279");
    }
  }

  else if (reaction.message.id === "717453314132017264") {
    const emojiId = reaction.emoji.id.toString();
    if (
      emojiList.hasOwnProperty(emojiId) ||
      emojiList.hasOwnProperty(reaction.emoji.name)
    ) {
      if (!reaction.message.guild.member.bot) {
        await reaction.message.guild
          .member(user)
          .roles.add(emojiList[emojiId].role);
        await functions.scrimScheduler(client);
      }
    }
  }
});
client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      functions.mention(client, error, "717320158460510279");
      return;
    }
  }

  if (reaction.message.id === "717453314132017264") {
    const emojiId = reaction.emoji.id.toString();
    if (
      emojiList.hasOwnProperty(emojiId) ||
      emojiList.hasOwnProperty(reaction.emoji.name)
    ) {
      if (!reaction.message.guild.member.bot) {
        await reaction.message.guild
          .member(user)
          .roles.remove(emojiList[emojiId].role);
        await functions.scrimScheduler(client);
      }
    }
  }
});
/*╔═══════════════════════════════════════╗
    Message
  ╚═══════════════════════════════════════╝*/
client.on("message", async message => {
  /*╔═══════════════════════════════════════╗
    Mentions
  ╚═══════════════════════════════════════╝*/
  const news = ["vrl", "vrml", "nada", "na_da", "esl", "vrml"];
  if (
    news.includes(message.content.toLowerCase()) &&
    !message.author.bot &&
    !message.content.toLowerCase().includes("canada")
  ) {
    functions.mention(client, message, "338649491894829057");
  } else if (
    message.content.toLowerCase().includes("sendo") &&
    !message.author.bot &&
    message.guild.id != "632570524463136779"
  ) {
    functions.mention(client, message, "119095000050040832");
  } else if (!message.author.bot) {
    /*╔═══════════════════════════════════════╗
     Dialogflow
  ╚═══════════════════════════════════════╝*/
    if (message.channel.type == "dm" && client.user.id != message.author.id) {
      const answer = await functions.dialogflowQuery(
        message,
        message.cleanContent
      );
      if (answer.intent === "history") {
        message.reply(text.History1);
        message.reply(text.History2);
      } else if (answer.intent === "urban") {
        const entityValue =
          answer.result[0].queryResult.parameters.fields.word.stringValue;
        const body = await fetch(
          `https://api.urbandictionary.com/v0/define?term=${entityValue}`
        )
          .then(response => response.json())
          .catch(err => {
            console.log(err);
          });
        if (body.list[0] == undefined) {
          message.reply(
            " even the urban dictionary doesn't know that word. Admit it, you made that shit up!"
          );
        } else {
          message.reply(
            `**The Urban Dictionary defines "${entityValue}" as:**\n\n *${body.list[0].definition}*\n\n You can read more about "${entityValue}" here: <${body.list[0].permalink}>`
          );
        }
      } else {
        message.reply(answer.response);
        functions.inform(client, message, answer);
      }
    } else if (
      (message.cleanContent.startsWith("@" + client.user.username + " ") ||
        message.cleanContent.startsWith(client.user.username + " ") ||
        message.cleanContent.startsWith(
          client.user.username.toLowerCase() + " "
        ) ||
        message.cleanContent.startsWith(
          client.user.username.charAt(0).toUpperCase() +
            client.user.username.slice(1).toLowerCase() +
            " "
        )) &&
      client.user.id != message.author.id
    ) {
      const answer = await functions.dialogflowQuery(
        message,
        message.cleanContent
          .split(" ")
          .slice(1)
          .join(" ")
      );

      const euServerList = ["lft", "Scrimmer", "Apex", "Climbey"];

      if (euServerList.includes(answer.intent)) {
        message.guild
          .member(message.author.id)
          .roles.add(roleList.get(answer.intent));
        message.reply(answer.response);
      } else if (answer.intent.substring(0, 6) === "remove") {
        const roleString = answer.intent.substring(7);

        message.guild
          .member(message.author.id)
          .roles.remove(roleList.get(roleString));
        message.reply(answer.response);
      } else if (answer.intent === "history") {
        message.reply(text.History1);
        message.reply(text.History2);
      } else if (answer.intent === "urban") {
        const entityValue =
          answer.result[0].queryResult.parameters.fields.word.stringValue;
        const body = await fetch(
          `https://api.urbandictionary.com/v0/define?term=${entityValue}`
        )
          .then(response => response.json())
          .catch(error => {
            functions.mention(client, error, "717320158460510279");
          });
        if (body.list[0] == undefined) {
          message.reply(
            " even the urban dictionary doesn't know that word. Admit it, you made that shit up!"
          );
        } else {
          message.reply(
            `**The Urban Dictionary defines "${entityValue}" as:**\n\n *${body.list[0].definition}*\n\n You can read more about "${entityValue}" here: <${body.list[0].permalink}>`
          );
        }
      } else {
        message.reply(answer.response);
      }
      /*╔═══════════════════════════════════════╗
    Commands
  ╚═══════════════════════════════════════╝*/
    } else if (!message.content.startsWith(prefix) || message.author.bot)
      return;
    client.commands = new Discord.Collection();
    const commandFiles = fs
      .readdirSync("./commands")
      .filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      client.commands.set(command.name, command);
    }
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (!client.commands.has(command)) return;
    try {
      if (command != "") {
        client.commands.get(command).execute(message, args);
      }
    } catch (error) {
      functions.mention(client, error, "717320158460510279");
    }
  }
});
/*╔═══════════════════════════════════════╗
    Deleted Messages
  ╚═══════════════════════════════════════╝*/
client.on("messageDelete", async message => {
  const entry = await message.guild
    .fetchAuditLogs({ type: "MESSAGE_DELETE" })
    .then(audit => audit.entries.first());
  let user = "";
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
  const delmsg = {
    embed: {
      color: 1,
      description: `${message.content}`,
      timestamp: "",
      author: {
        name: `${user} deleted a message from ${message.author.username} in #${message.channel.name}`
      }
    }
  };

  client.channels.cache.get("718176504437276682").send(delmsg);
});
client.login(process.env.BOT);
