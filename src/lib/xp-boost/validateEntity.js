const { Resolvers } = require('@sapphire/framework');

module.exports = async function validateEntity(entity, guild) {
    const role = (await Resolvers.resolveRole(entity, guild)).unwrapOrElse(() => null);
    let channel = (await Resolvers.resolveGuildTextChannel(entity, guild)).unwrapOrElse(() => null);

    if (!channel) {
      channel = (await Resolvers.resolveGuildCategoryChannel(entity, guild)).unwrapOrElse(() => null);
    }

    if (role) return role;
    if (channel) return channel;

    return null;
  }