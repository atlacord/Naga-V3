const EXACT_USER_REGEX = /<@!?([0-9]+)>$/g;
const WILD_USER_REGEX = /<@!?([0-9]+)>/g;

const ROLE_MENTION_REGEX = /<@&([0-9]+)>/g;
const CHANNEL_MENTION_REGEX = /<#([0-9]+)/g;
const SNOWFLAKE_REGEX = /^([0-9]+)$/g;

class Resolver {
	static promiseCache = new Map();
	/**
	 * Resolve username/id/mention
	 */
	async user(guild, user, exact) {
		if (!user) {
			return null;
		}

		let users;

		let query = user.includes('#') ? user.split('#')[0] : user;

		if (query.includes('<@')) {
			const regex = exact ? EXACT_USER_REGEX : WILD_USER_REGEX;
			const mentionId = regex.exec(query);
			if (mentionId && mentionId.length > 1) {
				query = mentionId[1];
			}
		}

		try {
			users = await this.getMembers(guild, query, exact);
		} catch (err) {
			console.error(err);
		}

		if (!users || !users.length) {
			return null;
		}

		// check if it's an id
		if (query.match(SNOWFLAKE_REGEX)) {
			return users.cache.find(u => u.id === query);
		}

		// check if it's username#1337
		if (user.indexOf('#') > -1) {
			const [name, discrim] = user.split('#');
			const nameDiscrimSearch = users.cache.find(u => u.username === name && u.discriminator === discrim);
			if (nameDiscrimSearch) {
				return nameDiscrimSearch;
			}
		}

		const exactNameSearch = users.cache.find(u => u.username === user);
		if (exactNameSearch) {
			return exactNameSearch;
		}

		if (!exact) {
			const escapedUser = this.container.utils.regEscape(user);
			// username match
			const userNameSearch = users.find(u => u.username.match(new RegExp(`^${escapedUser}.*`, 'i')) != undefined);
			if (userNameSearch) {
				return userNameSearch;
			}
		}

		return null;
	}

	role(guild, role) {
		const mention = ROLE_MENTION_REGEX.exec(role);
		if (mention && mention.length > 1) {
			return guild.roles.fetch(mention[1]);
		}

		if (role.match(SNOWFLAKE_REGEX)) {
			const roleIdSearch = guild.roles.fetch(role);
			if (roleIdSearch) {
				return roleIdSearch;
			}
		}

		const exactNameSearch = guild.roles.cache.find(r => r.name.toLowerCase() === role.toLowerCase());
		if (exactNameSearch) {
			return exactNameSearch;
		}

		const escapedRole = this.container.utils.regEscape(role);

		const roleNameSearch = guild.roles.cache.find(r => r.name.match(new RegExp(`^${escapedRole}.*`, 'i')) != undefined);
		if (roleNameSearch) {
			return roleNameSearch;
		}

		return null;
	}

	channel(guild, channel) {
		const mention = CHANNEL_MENTION_REGEX.exec(channel);
		if (mention && mention.length > 1) {
			return guild.channels.fetch(mention[1]);
		}

		if (channel.match(SNOWFLAKE_REGEX)) {
			const channelIdSearch = guild.channels.fetch(channel);
			if (channelIdSearch) {
				return channelIdSearch;
			}
		}

		const channelNameSearch = guild.channels.cache.find(c => c.name === channel);
		if (channelNameSearch) {
			return channelNameSearch;
		}
	}

	getMembers(guild, query, exact, presence) {
		const opts = {
			limit: 20,
			time: 60000,
		};

		const cacheKey = `${guild}${query}`;
		if(this.promiseCache.has(cacheKey)) {
			return this.promiseCache.get(cacheKey);
		}

		if (query.match(SNOWFLAKE_REGEX)) {
			opts.user = [query];
		} else {
			opts.query = query;
		}

        if (presence) {
            opts.withPresence = true;
        }

		const promise = (async (res, rej) => {
			try {
				return guild.members.fetch(opts);
			} finally {
				setTimeout(() => this.promiseCache.delete(cacheKey), 5000);
			}
		})();

		this.promiseCache.set(cacheKey, promise);
		return promise;
	}
}

module.exports = { Resolver };
