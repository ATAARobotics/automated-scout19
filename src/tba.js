const request = require('request-promise-native');
const _ = require('lodash');

const TBA = 'https://www.thebluealliance.com/api/v3';
const API_KEY = 'T9N5KCUoNH0Qe36RwOJPtGUVic2y7SMTi98AvYFUjmitkEe5C6NK9Eq8coIWHlSV';

module.exports = {
  get: (path, options = {}) => request(_.merge(options, {
    uri: `${TBA}${path}`,
    headers: { 'X-TBA-Auth-Key': API_KEY },
    // default to json response if not explictly turned off
    json: options.json !== false,
  })),
};