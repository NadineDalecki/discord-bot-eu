/*╔══════════════════════════════════════╗
    Express
  ╚═══════════════════════════════════════╝*/
;(express = require("express")), (app = express())

app.get("/", (request, response) => {
	response.sendStatus(200)
})
app.listen(process.env.PORT)
/*╔═══════════════════════════════════════╗
    Bot
  ╚═══════════════════════════════════════╝*/
const Discord = require("discord.js")
const Prefix = "!"
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] })
const roleList = require("./info/roles.js")
const functions = require("./functions.js")

client.once("ready", () => {
	console.log("Ready!")
})

client.on("guildMemberAdd", member => {
	try {
		const text = require("./info/text.js")
		setTimeout(function () {
			member.send(text.Welcome1)
			member.send(text.Welcome2)
		}, 3000)
	} catch (error) {
		functions.error(client, error)
	}
})
/*╔═══════════════════════════════════════╗
    Errors
  ╚═══════════════════════════════════════╝*/
client.on("error", error => functions.error(client, error))
process.on("error", error => functions.error(client, error))
process.on("uncaughtException", error => functions.error(client, error))
process.on("unhandledRejection", error => functions.error(client, error))
/*╔═══════════════════════════════════════╗
    Message
  ╚═══════════════════════════════════════╝*/
client.on("message", async message => {
	/*╔═══════════════════════════════════════╗
        Mentions
      ╚═══════════════════════════════════════╝*/
	const news = ["vrl", "vrml", "nada", "na_da", "esl", "vrml"]
	if (news.includes(message.content.toLowerCase()) && !message.author.bot && !message.content.toLowerCase().includes("canada")) {
		functions.mention(client, message, "338649491894829057")
	} else if (message.content.toLowerCase().includes("sendo") && !message.author.bot && message.guild.id != "632570524463136779") {
		functions.mention(client, message, "119095000050040832")
	} else if (!message.author.bot) {
	  /*╔═══════════════════════════════════════╗
          Dialogflow
        ╚═══════════════════════════════════════╝*/
	  /*┌───────────────────────────┐
          DM
        └───────────────────────────┘ */

		if (message.channel.type == "dm" && client.user.id != message.author.id && !message.content.startsWith(Prefix)) {
			const df = require("./dialogflow-functions.js")
			const answer = await functions.DialogflowQuery(message, message.cleanContent)
			df.function(client, answer, message)
	  /*┌───────────────────────────┐
          Public Messages
        └───────────────────────────┘ */
		} else if ((message.cleanContent.startsWith("@" + client.user.username + " ") || message.cleanContent.startsWith(client.user.username + " ") || message.cleanContent.startsWith(client.user.username.toLowerCase() + " ")) && client.user.id != message.author.id) {
			const answer = await functions.DialogflowQuery(message, message.cleanContent.split(" ").slice(1).join(" "))
			//--- Role Assignment ---
			const euServerList = ["lft", "Scrimmer", "Climbey"]
			if (euServerList.includes(answer.intent)) {
				message.guild.member(message.author.id).roles.add(roleList.get(answer.intent))
				message.reply(answer.response)
			} else if (answer.intent.substring(0, 6) === "remove") {
				const roleString = answer.intent.substring(7)
				message.guild.member(message.author.id).roles.remove(roleList.get(roleString))
				message.reply(answer.response)
				//--- Default ---
			} else {
				df.function(client, answer, message)
			}
		/*╔═══════════════════════════════════════╗
            Commands
          ╚═══════════════════════════════════════╝*/
		} else if (!message.content.startsWith(Prefix) || message.author.bot) return

		client.commands = new Discord.Collection()
		const fs = require("fs")
		const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
		for (const file of commandFiles) {
			const command = require(`./commands/${file}`)
			client.commands.set(command.name, command)
		}
		const args = message.content.slice(Prefix.length).split(/ +/)
		const command = args.shift().toLowerCase()
		if (!client.commands.has(command)) return
		try {
			if (command != "") {
				client.commands.get(command).execute(message, args)
			}
		} catch (error) {
			functions.error(client, error)
		}
	}
})
/*╔═══════════════════════════════════════╗
      Deleted Messages
  ╚═══════════════════════════════════════╝*/
client.on("messageDelete", async message => {
	functions.deletedMessage(client, message)
})
client.login(process.env.BOT)