# Naga V3
Naga is a multi-purpose bot created for the [Avatar: The Last Airbender Discord community](https://discord.gg/avatar). It is written in JavaScript using the [discord.js](https://github.com/discordjs/discord.js) library and the [Sapphire](https://github.com/sapphiredev/framework) framework. It's recommened that you familiarize yourself with both before using V3.

This is the third version of this bot. V2 is located [here](https://github.com/atlacord/Naga).

## Set Up
### Prequisites
1. nvm
2. Bot token
3. A MongoDB database with a `server_config` and `user_profile` collection. I recommend using MongoDB Atlas for this — it's easy to set up and free for small projects.

### Instructions
1. Clone the repo. 
2. Run `nvm use` in the root directory of the project. This will set your node version to the one specified in .nvmrc, which is the latest Node LTS release (as of writing).
3. Run `npm ci`.
4. Create a copy of .env.example, rename it .env, and fill it out. At the minimum, you need to have a bot token and a MongoDB connection string.
5. Run `npm start` in the root directory of the project to start the bot.

## Accessing the Models
To access models within a command or listener file, use `this.container.models.get('[model name]')`. The model name has to be the name of the model file; it is case-sensitive. All models are located in `src/models/`.

## Accessing Utility Functions
To access utility functions within a command or listener, use `this.container.utils`. For example, if I wanted to use the `sendSuccess` function, I would use `this.container.utils.sendSuccess()`. All utility functions are located in `src/lib/utils/Utilities.js`.

## $command Placeholder
You may want to include references to your currently set prefix + the command name in your command's information without having to hardcode the prefix and name in each file. You do so by using the `$command` placeholder, which will replace it with your prefix and the name when using `help [command]`.

This currently only works for the `description` and `detailedDescription` fields.

Example usage:
```
const { Command } = require('@sapphire/framework');

class ChangeNickname extends Command {
  constructor(context, options) {
    super(context, {
      ...options, 
      name: 'changenick',
      description: 'Change a user's nickname.',
      detailedDescription: {
        usage: '$command [user]'
      }
    });
  }

  async messageRun(message) {
    // code
  }
}
```

## Preconditions
Command permissions are dictated by precondition files, which are located in `src/preconditions`. 

For staff, the highest permission available is Admin, followed by Sentry, and then Dai Li. The permission system is designed so that staff can use commands that, at a minimum, require a staff role that is equal to or lower than one they currently possess. The only staff role that doesn't fall into this hierarchy is Mover Star; commands that require this role to be present can also be used by Sentries and Admins.

For instance, if there is a 'timeout' command that requires the user to have the Dai Li role, Sentries and Admins can also use the command without having to explicitly state it within the command file itself.

Developers can bypass all command restrictions. If you want to make a command developer-only, there is a precondition file for that. You can make youself a developer by adding your user ID to the `DEVELOPERS` environment variable in your .env file.

For more information about preconditions, including how to use them in command, check [this](https://sapphirejs.dev/docs/Guide/preconditions/what-are-preconditions) out.

## Changes from V2
- Models don't have to be imported into command or listener files anymore, they can be access from `this.container`.
- `Model.findById()` no longer accepts a callback function — you have to use `await` or `then/catch`. This is because V3 uses a newer version of Mongoose.
  - So, for instance, this code is no longer valid: 
  ```
  const profile = this.container.models.get('Profile');
  profile.findById('260600155630338048', (err, doc) => {
    // code
  });
  ```
  - You would have to do something like this: 
  ```
  const profile = this.container.models.get('Profile');

  // one way
  const result = await profile.findById('260600155630338048');
  
  // another way
  profile.findById('260600155630338048')
    .then((doc) => // code)
    .catch((err) => console.error(err));
  ```
- `package-lock.json` is being commited so that dependency versions remain consistent across different environments.
- `.nvmrc` is being commited as well to keep Node versions consistent across different environments.