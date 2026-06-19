let jwt = require('jsonwebtoken');

function createToken(data, duration) {
    const options = {
      issuer: 'modmail-api'
    };
  
    if (duration) {
      options.expiresIn = duration;
    };
  
    return jwt.sign(data, process.env.MODMAIL_API_SECRET, options);
};

async function route(interaction) {
    try {
        let category;
        switch (interaction.fields.components[0].component.values[0]) {
            case 'report':
                category = '719883529470738523';
                break;
            case 'suggestion':
                category = '719883529470738523';
                break;
            case 'eventmaster':
                category = '1039274712905298062';
                break;
            case 'partnerships':
                category = '1039274712905298062';
                break;
            case 'staffreport':
                category = '828540781291241492';
                break;
            case 'other':
                category = '719883529470738523';
                break;
        };

        const data = {
            user: interaction.member.user,
            category: category,
            content: interaction.fields.components[1].component.value
        };

        const payload = createToken(data);
        const res = await fetch(`http://${process.env.MODMAIL_API_HOST}/threads/create?t=${encodeURIComponent(payload)}`);
    } catch (err) {
        console.error(err);
    }
};

module.exports = { route };