const Discord = require('discord.js');
const randomcolor_1 = require("randomcolor");
const { query } = require("../handlers/DatabaseHandler");
const config = require("../config.json")

module.exports = function (client) {
    client.on("message", async message => {
        if (message.content.startsWith(config.bot.prefix + "top vanilla")) {
            var msg = message.content;
            msg = msg.split(config.bot.prefix + "top vanilla ");
            msg = msg[1];
            try {
                var user = await query("SELECT * FROM users WHERE username = ?", msg);
                var recentScore = await query("SELECT * FROM scores INNER JOIN beatmaps ON scores.beatmap_md5 = beatmaps.beatmap_md5 WHERE userid = ? ORDER BY pp DESC;", user[0].id)
                let color = randomcolor_1.randomColor();
                let hex = parseInt(color.replace(/^#/, ''), 16);
                
                const embed = new Discord.RichEmbed()
                    .setTitle("Top Score For " + msg)
                    .setURL("https://minase.tk/u/" + recentScore[0].userid)
                    .setColor(hex)
                    .setDescription(recentScore[0].song_name)
                    .setImage("https://assets.ppy.sh/beatmaps/" + recentScore[0].beatmapset_id + "/covers/cover.jpg")
                    .addField("PP:", recentScore[0].pp)
                    .addField("Score:", recentScore[0].score)
                    .addField("Accuracy:", Math.round(recentScore[0].accuracy) + "%")
                message.channel.send(embed);
            } catch (ex) {
                message.channel.send("user doesnt exist");
            }
        }
    })
}