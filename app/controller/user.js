'use strict';

const BaseController = require('./base');
const md5 = require('md5');

class UserController extends BaseController {
  async index() {
    const { ctx } = this;
    ctx.body = '用户信息';
  }
  async demoinfo() {
    // const { ctx } = this;
    this.success('成功信息');
  }
  async detail() {
    const { ctx } = this;
    const user = await this.checkEmail(ctx.state.email);
    this.success(user);
  }
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email });
    return user;
  }
  async create() {
    const { ctx } = this;
    const { email, password, emailcode, captcha, nickname } = ctx.request.body;
    if (emailcode !== ctx.session.emailcode) {
      return this.error('邮箱验证码出错');
    }
    console.log(captcha, ctx.session.captcha);
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码出错');
    }
    if (await this.checkEmail(email)) {
      return this.error('邮箱已存在');
    }
    const res = await ctx.model.User.create({ email, nickname, password: md5(password) });
    if (res._id) {
      this.message('注册成功');
    }
  }
  async captcha() {
    // 生成验证码
    const { ctx } = this;
    const captcha = await this.service.tools.captcha();
    ctx.session.captcha = captcha.text;
    console.log('验证码' + captcha.text);
    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data;
  }
  async email() {
    const { ctx } = this;
    const email = ctx.query.email;
    const code = Math.random().toString().slice(2, 6);
    console.log('邮件' + email + '验证码为' + code);
    const title = '验证码';
    const html = `
      <h1>验证码</h1>
      <div>
        <a>${code}</a>
      </div>
      `;
    const hasSend = await this.service.tools.sendEmail(email, title, html);
    if (hasSend) {
      ctx.session.emailcode = code;
      this.message('发送成功');
    } else {
      this.error('发送失败');
    }
  }
  async login() {
    // jwt
    const { ctx, app } = this;
    const { email, password } = ctx.request.body;
    const user = await ctx.model.User.findOne({
      email,
      password: md5(password),
    });
    if (user) {
      // 生成token
      const { nickname } = user;
      const token = app.jwt.sign({
        nickname,
        email,
        id: user._id,
      }, app.config.jwt.secret, {
        expiresIn: '1h',
        // expiresIn: '60s',
      });
      this.success({ email, token });
    } else {
      this.error('用户名或密码错误');
    }
  }
  async isFollow() {
    const { ctx } = this;
    const me = await ctx.model.User.findById(ctx.state.userid);
    const isFollow = !!me.following.find(id => id.toString() === ctx.params.id);
    this.success(isFollow);
  }
  async follow() {
    const { ctx } = this;
    const me = await ctx.model.User.findById(ctx.state.userid);
    const isFollow = !!me.following.find(id => id.toString() === ctx.params.id);
    if (!isFollow) {
      me.following.push(ctx.params.id);
      me.save();
      this.message('关注成功');
    }
  }
  async cancelFollow() {
    const { ctx } = this;
    const me = await ctx.model.User.findById(ctx.state.userid);
    const index = me.following.map(id => id.toString().indexOf(ctx.params.id));
    if (index > -1) {
      me.following.splice(index, 1);
      me.save();
      this.message('取消成功');
    }
  }
}

module.exports = UserController;
