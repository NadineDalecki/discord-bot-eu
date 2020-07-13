
const Attachment = require('discord.js').MessageAttachment;
module.exports = {
  name: 'spoon',
  execute(message, args) {
    message.channel.send(new Attachment('https://cdn.glitch.com/b7fd71af-5470-4b1a-aeb3-6ab4f0b67331%2Feslspoon.png?v=1560421422568', 'spoon.png'))
  }
}
