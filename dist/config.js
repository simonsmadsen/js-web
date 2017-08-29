'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const env = require('dotenv');
const axios = require('axios');
const fs = require('fs');

const envFileUrl = 'https://raw.githubusercontent.com/simonsmadsen/js-web/master/.env_template';

const tempaltePath = `${__dirname}/../template-files/.env_template`;

function downloadEnv() {
  axios.get(envFileUrl).then(r => {
    const data = r.data;
    const file = `${process.cwd()}/.env`;
    fs.writeFileSync(file, data);
  });
}

const getConfig = () => {
  const config = env.config().parsed;
  if (!config) {
    downloadEnv();
    return env.config({ path: tempaltePath }).parsed;
  }
  return config;
};

const config = getConfig();
exports.default = config;