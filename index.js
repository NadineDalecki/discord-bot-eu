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

  prefix = "!";

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
