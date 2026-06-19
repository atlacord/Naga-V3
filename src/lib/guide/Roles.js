const { MessageFlags } = require('discord.js');

let info = {
    'activity': {
        name: 'Activity-based Roles',
        shortname: 'activity',
        description: 'Roles unlocked via chat activity',
        roles: [
            'As you gain XP in the server (see the FAQ section in this channel for more information about XP), you will automatically receive special rank roles:',
            '- __1,150 XP__   • <@&720343753805660183> - Grants permissions to send images and embedded links.',
            '- __4,675 XP__   • <@&372178560254869504> - Grants access to Discord polls. ',
            '- __11,825 XP__  • <@&372163599130558466> - Grants access to one sub-bending role of your choice, as well as permission to request the <@&830138455337730049> role (see the "Requestable Roles" section).',
            '- __42,000 XP__  • <@&372179082634330112>',
            '- __101,675 XP__ • <@&372179236842242048>',
            '- __200,850 XP__   • <@&423269295930343424> ',
            '- __349,525 XP__   • <@&434950614997401600> - Allows custom bot commands, made in <#1093583806813970444>.',
            '- __557,700 XP__   • <@&811411225639518209> - Grants high level roles (<@&1180969376770441298>, <@&1180969390049607791>, <@&1180969386245378058>, <@&1180969398048129166> and <@&1180969393841242194>) based on the bending of your choice.',
            '- __835,375 XP__   • <@&811411331621191721> ',
            '- __1,192,550 XP__ • <@&811411413573697556>'
        ]
    },
    'requestable': {
        name: 'Requestable Roles',
        shortname: 'requestable',
        description: 'Roles that can be given by the staff team to users in good-standing upon request',
        roles: [
            'The following roles cannot be self-assigned, but eligible users **who are in good standing with the staff team** may request them by DMing <@718577208687460482>, our modmail bot:',
            '- <@&830138455337730049>  - Given to members who want to host events here. Grants access to <#1281662631698108486>, our channel where Event Masters organize and coordinate activities for the server. You must have the <@&372163599130558466> role (11,825 XP) to be eligible for the role; our staff team also reserves the right to remove this role from a user if they go a prolonged period without hosting any events.',
        ]
    },
    'prizes': {
        name: 'Honorary Roles, Prize Roles, and Other Non-Assignable Roles',
        shortname: 'prizes',
        description: 'Roles that are not regularly available and can only be obtained under special circumstances',
        roles: [
            'The following roles are not regularly available and can only be obtained under special circumstances:',
            '- <@&787644908705153024> – A special birthday role given automatically by <@772934946200485938> to users on their birthday (UTC time). You must have your birthday added to your Naga profile for this to work; you can set this up by using the \`n.setbirthday\` command in <#372087473892884502>.',
            '- <@&709818677532557343> – A temporary (1-week) role given to the winner(s) of Avatar games that we hold in the server. To get notifications for when such games are held, grab yourself the <@&709837040895656028> role (see "Choose your notifications!" in <id:customize>).',
            '- <@&516790566017564684> – A temporary (1-month) role given to the winner(s) of contest events that we hold in the server. To get notifications for when such events are held, grab yourself the <@&497208797039689749> role (see "Choose your notifications!" in <id:customize>). After 1 month, this role is removed and replaced with <@&530972685610778635> instead.',
            '- <@&586128911302131725> – An honorary role given automatically to server boosters. Grants access to <#826851222459514923>, our private chat channel for Team Avatar members.',
        ]
    }
};

function fetchRoles(category, isEdit) {
    if (isEdit) {
        return info[category].roles.join('\n');
    };

    return `## ${info[category].name}\n### ${info[category].description}\n\n${info[category].roles.join('\n')}`;
};

function roleInfo(category, isEdit) {
    let options = [];

    for (let r of Object.values(info)) {
        options.push({ label: r.name, value: r.shortname, description: r.description });
    };

    let roles = {
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        components: [
            {
                type: 17, // Container
                accent_color: 15913095,
                components: [
                    {
                        type: 10, // Description
                        content: '# Roles\nWe have heaps of roles! Select a category below to learn more!'
                    },
                    {
                        type: 14,
                        divider: true,
                        spacing: 1
                    },
                    {
                        type: 10, // Current category
                        content: fetchRoles(category)
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
                                custom_id: 'guide_roles_selectcategory',
                                placeholder: 'Select a role category',
                                options: options
                            }
                        ]
                    }
                ],
            }
        ]
    };

    if (isEdit) {
        roles.components[0].components[0].content = `## ${info[category].name}\n### ${info[category].description}`;
        roles.components[0].components[2].content = fetchRoles(category, true);
    };

    return roles;
}

module.exports = { roleInfo }