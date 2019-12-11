const redis = require('redis');
const request = require('request-promise');
const discord = require('discord.js');
module.exports = async function (client) {
    let RedisClient = redis.createClient();
    client.RCLIENT = RedisClient;
    client.RCLIENT.on('message', async (channel, message) => {
        //{'type':'set/map', id: 1234, by: 'kotypey'}
        let response = JSON.parse(message);
        let data = await request(`https://storage.ripple.moe/api/${response.type == 'set' ? 's' : 'b'}/${response.id}`, {json: true});
        let Tchannel = client.channels.get(client.config.bot.beatmap_channel);
        const embed = new discord.RichEmbed().setTitle(`**NEW RANKED BEATMAP** \`${data.Title}\``).setDescription(`[To download map click here](https://minase.tk/b/${data.ChildrenBeatmaps[0].BeatmapID})`).setColor('RANDOM').setImage(`https://assets.ppy.sh/beatmaps/${data.ChildrenBeatmaps[0].ParentSetID}/covers/cover.jpg`).addField('Ranked by', response.by ? response.by : 'Server');

        Tchannel.send(embed);

    })

    client.RCLIENT.subscribe('minase:rank_beatmap')//publish minase:rank_beatmap "{\"type\":\"set\", \"id\": \"113458\"}"
    
}