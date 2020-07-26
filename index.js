/*╔═══════════════════════════════════════╗
    ALL BOTS
  ╚═══════════════════════════════════════╝*/
    const Discord = require("discord.js")
    const Prefix = "?"
    const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]})
    const functions = require("./functions.js")
    const df = require("./dialogflow-functions.js")

    process.on("error", error => functions.Error(client, error));
    process.on("uncaughtException", error => functions.Error(client, error));
    process.on("unhandledRejection", error => functions.Error(client, error));

    client.once("ready", () => {client.user.setActivity("the salt server 👀", {url: "https://www.twitch.tv",type:"WATCHING"});console.log("Ready!");});
    client.on("error", error => functions.Error(client, error));
    client.on("messageDelete", async message => {functions.DeletedMessage(client, message);});
    // client.on("messageReactionAdd", async (reaction, user) => {functions.RoleAdd(reaction, user, id)});
    //client.on("messageReactionRemove", async (reaction, user) => {functions.RoleRemove(reaction, user, id)});
    client.on("guildMemberAdd", member => {
	try {
		const text = require("./info/text.js")
		setTimeout(function () {
			member.send(text.Welcome1)
			member.send(text.Welcome2)
		}, 3000)
	} catch (error) {functions.error(client, error)}})
    //client.on("guildMemberRemove", member => {client.channels.cache.get(process.env.LOG).send(`${member.user.username} left\nMember count: ${member.guild.memberCount}`);});
    //client.on("guildBanAdd", function(guild, user, member) {client.channels.cache.get(process.env.LOG).send(`${member.user.username} banned\nMember count: ${member.guild.memberCount}`);});
    client.login(process.env.BOT);

    const express = require("express");
    const app = express();
    app.get("/", (request, response) => {
    response.sendStatus(200);
    });
    app.listen(process.env.PORT);

/*╔═══════════════════════════════════════╗
    Message
  ╚═══════════════════════════════════════╝*/
  
client.on("message", async message => {
    if  (!message.author.bot) {
    /*┌───────────────────────────┐
        Mentions
      └───────────────────────────┘ */
      const News = ["nada", "na_da"]
        if (News.includes(message.content.toLowerCase()) && !message.author.bot && !message.content.toLowerCase().includes("canada")) {
                functions.Mention(client, message, "338649491894829057")
        } else if (message.content.toLowerCase().includes("sendo") && !message.author.bot && message.guild.id != "632570524463136779") {
                functions.Mention(client, message, "119095000050040832")
        }
    /*╔═══════════════════════════════════════╗
        Dialogflow
      ╚═══════════════════════════════════════╝*/
    /*┌───────────────────────────┐
        DM
      └───────────────────────────┘ */ 
        else if (message.channel.type == "dm" && client.user.id != message.author.id && !message.content.startsWith(Prefix)) {
			const df = require("./dialogflow-functions.js")
			const answer = await functions.DialogflowQuery(message, message.cleanContent)
			df.Function(client, answer, message)
        }
    /*┌───────────────────────────┐
        Public
      └───────────────────────────┘ */
        else if ((message.cleanContent.startsWith("@" + client.user.username + " ") || message.cleanContent.startsWith(client.user.username + " ") || message.cleanContent.startsWith(client.user.username.toLowerCase() + " ")) && client.user.id != message.author.id) {
			const answer = await functions.DialogflowQuery(message, message.cleanContent.split(" ").slice(1).join(" "))
			//--- Role Assignment ---
			const euServerList = ["lft", "Scrimmer", "Climbey"]
            const roleList = require("./info/roles.js")
			if (euServerList.includes(answer.intent)) {
				message.guild.member(message.author.id).roles.add(roleList.get(answer.intent))
				message.reply(answer.response)
			} else if (answer.intent.substring(0, 6) === "remove") {
				const roleString = answer.intent.substring(7)
				message.guild.member(message.author.id).roles.remove(roleList.get(roleString))
				message.reply(answer.response)
				//--- Default ---
			} else {
				df.Function(client, answer, message)
			}
        }
      /*╔═══════════════════════════════════════╗
          Commands
        ╚═══════════════════════════════════════╝*/
        else if (!message.content.startsWith(Prefix) || message.author.bot) return;
        functions.Command(client, message, Prefix);
    }});

