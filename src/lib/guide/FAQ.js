const { MessageFlags } = require('discord.js');

let questions = {
    'Where is the general chat?': `<#372087095121936385> and <#1033182943746723910> are the general off-topic chats\n- <#372086844956868618> and <#721604232532459540> are for ATLA and Legend of Korra discussions\n- Netflix's live-action adaptation of ATLA can be discussed in <#1120464986230239332>\n- New users who need a slower environment to ease into the server can chat in ⁠<#761932923217379338>\nBe sure to read the channel topics and the Channels section of this guide for more information.`,
    'How do I level up?': `You level up by being active in the server. Posting messages can get you between 15 and 25 XP. However, spamming doesn't help, because you can only gain XP once per minute, regardless of the number of messages. If you want to know your individual rank, type \`!rank\` in <#372087473892884502>. If you want to see the leaderboard, use \`!top\` in the same bot channel.`,
    'Why can\'t I post images or videos?': 'Image/file posting permissions are available to users that have the <@&720343753805660183> role. This role is automatically assigned after reaching **1,150 XP**. This is to prevent potential raids and spams by users who join the server for the first time.',
    'How can I choose a sub-bending role?': 'Members with the <@&372163599130558466> role are granted access to our sub-bending roles located in <#1065945888507310191>. This role is automatically assigned after reaching **11,825 XP**.'
};

let faq = {
    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
    components: [
        {
            type: 17, // Container
            accent_color: 15913095,
            components: [
                {
                    type: 10, // Description
                    content: '# Frequently Asked Questions'
                },
                {
                    type: 14,
                    divider: true,
                    spacing: 1
                },
                {
                    type: 10, // Questions
                    content: Object.entries(questions).map(([key, value]) => `## ${key}\n${value}`).join('\n\n')
                },
            ],
        }
    ]
};

module.exports = { faq };