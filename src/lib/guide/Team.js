const { MessageFlags } = require('discord.js');

const roles = [
    { 
        id: '372084219423490049',
        name: 'White Lotus - Admins',
        description: 'The server admins. They handle operations regarding server management.'
    },
    {
        id: '1182448979288527029', 
        name: 'Sentry - Senior Mods',
        description: 'Sentries handle community moderation, as well as having a larger role in day-to-day community operations.',
    },
    {
        id: '1182449762583191592', 
        name: 'Dai Li - Mods',
        description: 'The Dai Li, together with Sentries, enforce our rules and maintain a friendly environment.',
    },
    { 
        id: '1224072458206711928',
        name: 'Mover Stars - Events/PR',
        description: 'Mover Stars handle operations regarding our presence in the Avatar community and large-scale server events. They also assist with partnerships.'
    }
];

async function field(container, guild, role) {
    let userlist = [];
    const r = await guild.members.cache.filter(m => (m.roles.cache.has(role.id)));
    for (let i of r) {
        userlist.push(`${i[1].user.username} (<@${i[1].id}>)`);
    };
    userlist = userlist.length > 0 ? userlist.sort().join('\n') : 'You shouldn\'t see this message (fixing caching issues later)'; 
    return `## ${role.name}\n${role.description}\n\n${userlist}`;
};

async function team(container) {
    const guild = await container.client.guilds.cache.get('370708369951948800');
    const embed = {
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        components: [
            {
                type: 17, // Container
                accent_color: 15913095,
                components: [
                    {
                        type: 10, // Description
                        content: '# Staff Team\nGet to know our staff team!'
                    },
                    {
                        type: 14,
                        divider: true,
                        spacing: 1
                    },
                ],
            }
        ]
    };

    for (i of roles) {
        embed.components[0].components.push({ type: 10, content: await field(container, guild, i) }, { type: 14, divider: true, spacing: 1 });
    };

    return embed;
};

module.exports = { team };