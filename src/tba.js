const request = require('request');
const _ = require('lodash');
const NodeCache = require("node-cache");

const cache = new NodeCache();

const TBA = 'https://www.thebluealliance.com/api/v3';
const API_KEY = 'T9N5KCUoNH0Qe36RwOJPtGUVic2y7SMTi98AvYFUjmitkEe5C6NK9Eq8coIWHlSV';

var info = '';

module.exports = {
  get: async (path) => {
    var options = {
      uri: `${TBA}${path}`,
      headers: {
        'X-TBA-Auth-Key': API_KEY,
        'If-Modified-Since': cache.get(`${path}-time`)
      }
    };
    
    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        info = JSON.parse(body);
        cache.set(`${path}`, info);
        cache.set(`${path}-time`, response.headers['last-modified']);
        console.log('Getting data from TBA...');
      }
      if (!error && response.statusCode == 304) {
        info = cache.get(`${path}`);
        console.log('Using cached, unchanged.');
      }
      if (error) {
        console.log(`Error ${response.statusCode}`);
      }
    }
    
    request(options, callback);
  
    return info; 
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