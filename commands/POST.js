const roleList = require('../info/roles.js');
const Discord = require('discord.js');
const embed = new Discord.MessageEmbed()
.setColor('#50d0d9')
.setAuthor('Echo Arena Discord Europe')
.setDescription("Please invite EU players only. We kick everybody else!")
.addField('RAD/Echo', '[Echo Games Discord](https://discord.echo.games/)\n[RAD Media Files](https://readyatdawn.sharefile.com/share/view/sbcabc88d34842d1b)\n[Echo Font](https://www.1001fonts.com/conthrax-font.html)', false)
.addField('VRML', '[Website](https://vrmasterleague.com/EchoArena/)\n[Matches](https://vrmasterleague.com/EchoArena/Matches/)\n[Standings EU](https://vrmasterleague.com/EchoArena/Standings/N2xDeWlHMGUvZGc90)\n[Rules](https://vrmasterleague.com/EchoArena/Rules/)\n[Twitch](https://www.twitch.tv/EchoArena_VRML)\n\u200B\n', false)
.addField('VRL', '[Discord](https://discord.gg/rEweeRh)\n[Twitch](https://www.twitch.tv/vrchallenger)\n\u200B\n', false)
.addField('Roles', '**Ask <@717431243662295150> for a role!** Start your sentence with Affen and just ask for the role in a somewhat understandable sentence.\n*For example: Affen give me the god damn Looking for team role*\n\n**Available Roles:**\n<@&509787093208399872> Tag this role if you need a substitute for a scrim or want to start a mixed scrim.\n<@&549925842646597651> Need a team? Assign yourself this role.\n**@teams** is a role you can get from an admin once you joined a team. Please only ask teams for a scrim if you have a full team ready for at least an hour', false) 

module.exports = {
  name: 'post',
  execute(message) {
    message.delete().catch(_ => { });
    if (message.member.hasPermission('ADMINISTRATOR')) {     
      message.channel.send(embed)
    }
  }
}



