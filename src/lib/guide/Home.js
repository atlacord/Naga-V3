const { MessageFlags } = require('discord.js');

let description = [ 
    'We are a Discord community for fans of the Avatar Legends universe (ATLA, Legend of Korra, and all other related media). Established in 2017 and partnered with Discord since 2021, we are your one-stop shop for all things Avatar! We are not associated with Nickelodeon or Avatar Studios.',
    'For any questions, feedback, concerns or reports, you can contact the server staff by clicking the "Contact Staff" button below.',
    'Want to connect with us more? Check out these links below! We are **@atlacord** on most major platforms!'].join('\n\n');

let home = {
    flags: MessageFlags.IsComponentsV2,
    components: [
        {
            type: 17, // Container
            accent_color: 15913095,
            components: [
                {
                    type: 12, // Banner image
                    custom_id: 'guide_banner',
                    items: [
                        {
                            media: {
                                url: 'https://cdn.discordapp.com/attachments/1178846102586404884/1511432244055769168/guide-banner-2026.png',
                                content_type: 'image'
                            }
                        }
                    ]
                },
                {
                    type: 14,
                    divider: true,
                    spacing: 1
                },
                {
                    type: 10, // Description
                    content: description
                },
                {
                    type: 1,
                    components: [ // Consider changing these to emoji icons instead of text labels
                        {
                            type: 2,
                            label: 'Website',
                            style: 5,
                            url: 'https://atlacord.com',
                            disabled: true
                        },
                        {
                            type: 2,
                            label: 'Instagram',
                            style: 5,
                            url: 'https://instagram.com/atlacord',
                        },
                        {
                            type: 2,
                            label: 'Twitter',
                            style: 5,
                            url: 'https://twitter.com/atlacord'
                        },
                        {
                            type: 2,
                            label: 'YouTube',
                            style: 5,
                            url: 'https://youtube.com/@atlacord'
                        }
                    ]
                }
            ],
        },
        {
            type: 1, // Container for buttons
            components: [
                {
                    type: 2,
                    label: 'FAQ',
                    style: 1,
                    custom_id: 'guide_button_faq'
                },
                {
                    type: 2,
                    label: 'Role Info', 
                    style: 1, 
                    custom_id: 'guide_button_roleinfo'
                },
                {
                    type: 2,
                    label: 'Channel Info', 
                    style: 1, 
                    custom_id: 'guide_button_channelinfo'
                }, 
                {
                    type: 2,
                    label: 'Our Team', 
                    style: 1, 
                    custom_id: 'guide_button_team',
                    // disabled: true
                }, 
                {
                    type: 2,
                    label: 'Contact Staff',
                    style: 4,
                    custom_id: 'guide_button_contact',
                }
            ]
        }
    ]
};

module.exports = home;