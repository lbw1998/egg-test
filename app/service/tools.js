// eslint-disable-next-line strict
const Service = require('egg').Service;
const nodemailer = require('nodemailer');
const svgCaptcha = require('svg-captcha');

const userEmail = '326542193@qq.com';
const pass = 'jqaulbcgvwmhbhgd';
const transporter = nodemailer.createTransport({
  service: 'qq',
  port: 465,
  secureConnetion: true,
  auth: {
    user: userEmail,
    pass,
  },
});

class ToolService extends Service {
  captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      // background: '#77b0f9',
    });
    return captcha;
  }
  async sendEmail(email, title, html) {
    const mailOptions = {
      from: userEmail,
      to: email,
      subject: title,
      test: '',
      html,
    };
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = ToolService;
