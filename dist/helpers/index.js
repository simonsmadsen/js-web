'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const util = require('util');
const exec = require('child_process').exec;
const fs = require('fs');

const run = call => new Promise((resolve, reject) => {
  exec(call, (error, stdout, stderr) => {
    if (stderr) {
      console.log(stderr);
    }
    if (error) {
      //console.log(error)
    }
    resolve(stdout);
  });
});

if (!fs.existsSync('node_modules/bcrypt-node')) {
  console.log('You need bcrypt-node');
  run('npm install bcrypt-node --save');
}

const bcrypt = require('bcrypt-node');

const takeFirst = exports.takeFirst = arr => arr.length > 0 ? arr[0] : [];

const hash = exports.hash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(5));

const compareHash = exports.compareHash = (password, hash) => bcrypt.compareSync(password, hash);