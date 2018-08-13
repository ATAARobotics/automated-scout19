const fetch = require("node-fetch");
const NodeCache = require("node-cache");

const cache = new NodeCache();

const TBA = 'https://www.thebluealliance.com/api/v3';
const API_KEY = 'T9N5KCUoNH0Qe36RwOJPtGUVic2y7SMTi98AvYFUjmitkEe5C6NK9Eq8coIWHlSV';

module.exports = {
  get: async (path) => {
    var options = {
      headers: {
        'X-TBA-Auth-Key': API_KEY,
        'If-Modified-Since': cache.get(`${path}-time`)
      }
    };

    try {
      const response = await fetch(`${TBA}${path}`, options);
      if (response.status == 200) {
        var info = await response.json();
        cache.set(`${path}`, info);
        cache.set(`${path}-time`, response.headers.get('last-modified'));
        console.log('Getting data from TBA...');
        return info;
      } else if (response.status == 304) {
        console.log('Using cached, unchanged.');
        return cache.get(`${path}`);
      }
    } catch (error) {
      console.log(error);
    }

  },
  clearCache: async () => {
    cache.flushAll();
    var cacheStats = cache.getStats();
    return cacheStats;
  },
  cacheStats: async () => {
    var cacheStats = cache.getStats();
    return cacheStats;
  },
  cacheKeys: async () => {
    var keys = cache.keys();
    return keys;
  }
};