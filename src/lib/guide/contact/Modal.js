const modal = {
    custom_id: 'modal_contact',
    title: 'Contact Staff',
    components: [
        {
            type: 18,
            label: 'Category',
            component: {
                type: 3,
                custom_id: 'contact_category',
                placeholder: 'Selecting the category most relevant to your request will reduce the response time.',
                options: [
                    {
                        label: 'Report a user',
                        value: 'report',
                        description: 'Select this option if you need to report a user.',
                        emoji: {
                            name: '📣'
                        },
                    },
                    {
                        label: 'Server suggestion',
                        value: 'suggestion',
                        description: 'Please post server suggestions in #server-suggestions instead!',
                        disabled: true
                    },
                    {
                        label: 'Hosting events',
                        value: 'eventmaster',
                        description: 'Select this option if you\'re interested in hosting events in this community!',
                        emoji: {
                            name: '📅',
                        },
                    },
                    {
                        label: 'Partnerships',
                        value: 'partnership',
                        description: 'Select this option to get in touch with our PR team! Alternatively, email partnerships@atlacord.com.',
                        emoji: {
                            name: '👔',
                        },
                    },
                    {
                        label: 'Report a staff member',
                        value: 'staffreport',
                        description: 'Staff reports are only visible to admins. If reporting an admin, please DM our owner TwoDog instead.',
                        emoji: {
                            name: '📣'
                        },
                    },
                    {
                        label: 'Other',
                        value: 'other',
                        description: 'For requests that don\'t fit into any of the other categories.',
                        emoji: {
                            name: '🗂️'
                        },
                    }
                ]
            }
        },
        {
            type: 18,
            label: 'Request',
            description: 'Anything you type in the box below will be sent to the mod team',
            component: {
                type: 4,
                custom_id: 'contact_textfield',
                style: 2,
                min_length: 20,
                max_length: 4000,
                placeholder: 'Write your request here.',
                required: true
            }
        }
    ]
};

module.exports = modal;