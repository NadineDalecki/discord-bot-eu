const functions = require("./functions.js");
const fetch = require("node-fetch");

module.exports = {
  function: async function(client, answer, message) {
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
        .catch(error => {
          functions.error(client, error);
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
      functions.inform(client, answer, message);
    }
  }
};
