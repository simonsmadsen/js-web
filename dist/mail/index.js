'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.htmlMail = htmlMail;
exports.plainMail = plainMail;

var _template = require('../template');

var _template2 = _interopRequireDefault(_template);

var _config = require('./../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const nodemailer = require('nodemailer');

const smtpConfig = {
  host: _config2.default.mail_host,
  port: _config2.default.mail_port,
  secure: _config2.default.mail_ssl === 'true',
  auth: {
    user: _config2.default.mail_user,
    pass: _config2.default.mail_password
  }
};

const transporter = nodemailer.createTransport(smtpConfig);
function htmlMail(to, subject, html, data) {
  const mailOptions = {
    from: _config2.default.mail_from,
    to,
    subject,
    text: '',
    html: (0, _template2.default)(html)(data)
  };

  transporter.sendMail(mailOptions, error => {
    if (error) {
      console.log(error);
    }
  });
}

function plainMail(to, subject, text) {
  const mailOptions = {
    from: _config2.default.mail_from,
    to,
    subject,
    text,
    html: ''
  };

  transporter.sendMail(mailOptions, error => {
    if (error) {
      console.log(error);
    }
  });
}