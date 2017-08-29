'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.post = post;
exports.image = image;
const axios = require('axios');
const fs = require('fs');

exports.axios = axios;
async function get(url, params) {
  return axios.get(url, {
    params
  }).then(r => r.data);
}

async function post(url, params, headers) {
  return axios.post(url, params, {
    headers
  }).then(r => r.data);
}

async function image(url, location) {
  try {
    const picture = await axios.get(url, {
      params: {},
      responseType: 'arraybuffer'
    }).then(r => r.data);

    fs.writeFileSync(location, new Buffer(picture, 'binary'), 'binary');
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}