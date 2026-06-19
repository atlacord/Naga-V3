const { MessageFlags } = require('discord.js');

let info = {
    'guide': {
        name: 'Server Guide',
        shortname: 'guide',
        description: 'Server updates, event announcements, Avatar news, and more.',
        emoji: {
            id: null,
            name: '📚'
        },
        channels: [
            '- <#1066580298290176121> - Our server rules. Be sure to read them before participating in the server!',
            '- <#1053064927935467530> - The channel you\'re in now! The important information hub of the server.',
            '- <#1178886255644250122> - Meet our staff team! Introductions for every member are in here.',
            '- <#1305666414610350090> - Our partnered Discord servers which you can also join and enjoy!',
            '- <#1065945888507310191> - Our channel for assigning level-restricted roles (eg. sub-bending)! You must have the <@&372163599130558466> role to access this channel.',
        ]
    },
    'bulletin': {
        name: 'Bulletin',
        shortname: 'bulletin',
        description: 'Server updates, events, and Avatar news',
        emoji: {
            id: null,
            name: '📣'
        },
        channels: [
            '- <#372088315467399170> - Server updates are announced here!',
            '- <#831063798873587743> - Community events such as streams, gaming/book/music nights, and much more are announced here!',
            '- <#835240650051944469> - News related to the Avatar Universe is posted here.',
            '- <#782411596679872542> - Channel for all minor server changes and updates for channels and features.',
            '- <#1200650255524438096> - Our hall of fame for past contest winners!',
            'Be sure to give yourself appropriate roles in <id:customize> for notifications in all previously listed channels!'
        ]
    },
    'meta': {
        name: 'Meta',
        shortname: 'meta',
        description: 'The home for topics about the server itself (suggestions, weekly discussions, and any contests.',
        emoji: {
            id: null,
            name: '🔮'
        },
        channels: [
            '- <#1093583806813970444> - Post your suggestions here for the staff to review!',
            '- <#794360973963165716> - Place your emote ideas which you would like to see in the server!',
            '- <#709827097559826553> - Avatar Games channel that opens periodically when a game is hosted. Users with the <@&709837040895656028> role will be notified when it\'s open.',
            'Any ongoing contest channels will go into this category as well!',
            '- <#498253602788343827> - Discuss the latest weekly topic, as long as it\'s within the rules!',
        ]
    },
    'general': {
        name: 'General Channels',
        shortname: 'general',
        description: 'The home for our general channels.',
        emoji: {
            id: null,
            name: '💬'
        },
        channels: [
            '- <#761932923217379338> - A Channel for the arrival of new members and for us to greet them!',
            '- <#1007044599287656559> - Our server members\'s birthdays are announced here. Info on how to sign up in this channel. Feel free to congratulate and shout-out the <@&787644908705153024> members there as well.',
            '- <#826851222459514923> - A private channel for server boosters.',
            '- <#372087095121936385> - Our general chat of the server, off-topic conversations and A:TLA&TLOK talk is allowed.',
            '- <#1033182943746723910> - A forum channel for users to discuss general topics at their own pace. Anything goes! Be sure to check out the [pinned post](https://discord.com/channels/370708369951948800/1307805274593169489)!',
            '- <#372087205063163907> - Post your memes and other videos and images here. No NSFW/NSFL content and any content that breaks the rules.',
            '- <#719848144719970324> - The best jokes and moments go here.'
        ]
    },
    'avatar': {
        name: 'Avatar Channels',
        shortname: 'avatar',
        description: 'The home for Avatar topics (all three series, the upcoming movie, the Netflix live-action show, etc)',
        emoji: {
            id: null,
            name: '⬇'
        },
        channels: [
            '- <#372086844956868618> - The main channel for Avatar: The Last Airbender discussions.',
            '- <#721604232532459540> - The main channel for Legend of Korra discussions.',
            '- <#1120464986230239332> - Discuss Netflix\'s live-action adaptation of Avatar: The Last Airbender here!',
            '- <#1315885439885901846> - Here you can discuss anything else within our beloved Avatarverse! Also the go-to spot for threads on the latest from Avatar Studios.',
        ]
    },
    'misc': {
        name: 'Miscellaneous',
        shortname: 'misc',
        description: 'The category for topic-based channels (creative works, entertainment, wholesome, etc.)',
        emoji: {
            id: null,
            name: '🌐'
        },
        channels: [
            '- <#726405096132575322> - For pictures of your pets, food, or any other amazing things you\'d like to share.',
            '- <#372087240270151680> - For all forms of art! Be sure to credit the artist by posting a link to the source. Discussions of these works should be done in <#884990489756045332>! Infringement and theft of intellectual property is forbidden and subject to punishment by rule 6 in <#1066580298290176121>.',
            '- <#884990489756045332> - For discussing art or other creative works posted in <#372087240270151680>!',
            '- <#487958065690312724> - For discussing sports, music, movies, TV shows, games or books! Be sure to use spoiler tags if something recently released is being discussed! Any announcements regarding gaming offers will be posted and pinned in this channel too!',
            '- <#902485012337799189> - For wholesome content of all forms such as nice things that happened in life, or wholesome things from around Discord! Also be sure to participate in our Wholesome Wednesdays, and give yourself the appropriate role (see "Choose your notifications!" in <id:customize>) to be pinged for these!'
        ]
    },
    'bots': {
        name: 'Sato\'s Workshop',
        shortname: 'bots',
        description: 'Our bot command category. There are separate channels for Naga, our trivia bot, and every other bot.',
        emoji: {
            id: null,
            name: '🤖'
        },
        channels: [
            '- <#829563592173027369> - Channel for playing with our <@772934946200485938> multi-purpose bot through various games!',
            '- <#372087473892884502> - The standard channel for sending bot commands.',
            '- <#1482148493010141327> - The channel for our Avatar RPG bot',
            '- <#418988592740958208> - The Trivia Rumble channel for playing Trivia games with our custom <@631650441477750808> trivia bot!'
        ]
    },
    'voice': {
        name: 'Voice Channels',
        shortname: 'voice',
        description: 'The text chat for each voice channel is located within that VC itself.',
        emoji: {
            id: null,
            name: '🎙'
        },
        channels: [
            '- <#1320181228254658572> - Use this channel to listen to music or just chat!',
            '- <#372087824083845130> - Secondary VC, same purpose as above channel',
            '- <#836266973746692116> - Many of our events, such as movie nights, AMAs, and more take place here!'
        ]
    }
};

function fetchChannels(category, isEdit) {
    if (isEdit) {
        return info[category].channels.join('\n');
    };

    return `## ${info[category].emoji.name}  ${info[category].name}\n### ${info[category].description}\n\n${info[category].channels.join('\n')}`;
};

function channelInfo(category, isEdit) {
    let options = [];

    for (let c of Object.values(info)) {
        options.push({ label: c.name, value: c.shortname, description: c.description, emoji: c.emoji });
    };

    let channels = {
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        components: [
            {
                type: 17, // Container
                accent_color: 15913095,
                components: [
                    {
                        type: 10, // Description
                        content: '# Channels\nWe have a large variety of channels. Click a category below to learn more!'
                    },
                    {
                        type: 14,
                        divider: true,
                        spacing: 1
                    },
                    {
                        type: 10, // Current category
                        content: fetchChannels(category)
                    },
                    { 
                        type: 14,
                        divider: true,
                        spacing: 1
                    },
                    {
                        type: 1, // Category selection component
                        components: [
                            {
                                type: 3,
                                custom_id: 'guide_channels_selectcategory',
                                placeholder: 'Select a channel category',
                                options: options
                            }
                        ]
                    }
                ],
            }
        ]
    };

    if (isEdit) {
        channels.components[0].components[0].content = `## ${info[category].emoji.name}  ${info[category].name}\n### ${info[category].description}`;
        channels.components[0].components[2].content = fetchChannels(category, true);
    };

    return channels;
}

module.exports = { channelInfo }