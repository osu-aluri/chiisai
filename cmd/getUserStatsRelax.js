const Discord = require('discord.js');
const randomcolor_1 = require("randomcolor");
const { query } = require("../handlers/DatabaseHandler");
const config = require("../config.json")

module.exports = function (client) {
    client.on("message", async message => {
        if (message.content.startsWith(config.bot.prefix + "stats relax")) {
            var msg = message.content;
            msg = msg.split(config.bot.prefix + "stats relax ");
            msg = msg[1];
            try {
                var user = await query("SELECT * FROM users WHERE username = ?", msg);
                var userStats = await query("SELECT * FROM users_stats WHERE username = ?", msg);

                let color = randomcolor_1.randomColor();
                let hex = parseInt(color.replace(/^#/, ''), 16);
                const embed = new Discord.RichEmbed()
                    .setTitle("Stats for " + msg)
                    .setURL("https://minase.tk/u/" + user[0].id)
                    .setColor(hex)
                    .setThumbnail("https://a.minase.tk/" + user[0].id)
                    .addField("Performance (Standard)", userStats[0].pp_std_rx, true)
                    .addField("Performance (Mania)", userStats[0].pp_mania_rx, true)
                    .addField("Performance (Taiko)", userStats[0].pp_taiko_rx, true)
                    .addField("Performance (Catch The Beat)", userStats[0].pp_ctb_rx, true)
                    .addField("Country", userStats[0].country)
                    
                    message.channel.send(embed)
            } catch (ex) {
                message.channel.send("user doesnt exist");
            }
        }
    })
}