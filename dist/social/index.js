'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFacebookFields = getFacebookFields;
exports.getFacebookImage = getFacebookImage;
exports.getGoogleImage = getGoogleImage;
exports.getTwitterImage = getTwitterImage;
const axios = require('axios');
const fs = require('fs');

const downloadImage = async (url, location) => {
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
};

const get = async (url, params) => axios.get(url, {
  params
}).then(r => r.data);

async function getFacebookFields(accessToken, fields = 'name,id') {
  return get('https://graph.facebook.com/me', {
    access_token: accessToken,
    fields
  });
}

async function getFacebookImage(accessToken, path, type = 'normal') {
  const data = await get('https://graph.facebook.com/me', {
    access_token: accessToken,
    fields: `id,name,picture.type(${type})`
  });
  return downloadImage(data.picture.data.url, path);
}

async function getGoogleImage(id, path) {
  const data = await get(`https://www.googleapis.com/plus/v1/people/${id}`, {
    key: 'AIzaSyDmtOprCuInKskmUADauny0BI7tGT2Pnjs',
    fields: 'image'
  });
  return downloadImage(data.image.url, path);
}

async function getTwitterImage(screenName, path) {
  return downloadImage(`https://twitter.com/${screenName}/profile_image?size=normal`, path);
}