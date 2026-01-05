const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serverModel = mongoose.model('server_config', new Schema({
  _id: String,
  data: {
    logs: {
        events: { type: Array, default: null },
        logChannel: { type: String, default: null },
        ignoredChannels: { type: Array, default: null }
    },
    xpBoost: {
      roles: { 
        type: Map, 
        of: String,
        default: () => new Map()
      },
      channels: {
        type: Map, 
        of: String,
        default: () => new Map()
      },
      ignoredChannels: { type: Array, default: [] }
    },
    joinMessages: { type: Array, default: [] },
    usedBanners: { type: Array, default: [] },
    topics: { type: Array, default: [] },
    atlaTopics: { type: Array, default: [] },
    lokTopics: { type: Array, default: [] },
    wyrs: { type: Array, default: [] },
    ignoredTopics: { type: Array, default: [] },
    ignoredKorraTopics: { type: Array, default: [] },
    ignoredATLATopics: { type: Array, default: [] },
    ignoredWyrs: { type: Array, default: [] },
    topicTimestamps: { 
      normal: { type: Number, default: null },
      atla: { type: Number, default: null },
      korra: { type: Number, default: null },
    },
  }
}, {
    autoIndex: true,
    minimize: false,
}));

module.exports = serverModel;