/* eslint-disable strict */
const BaseController = require('./base');
const marked = require('marked');

class ArticleController extends BaseController {
  async index() {
    const { ctx } = this;
    const articles = await ctx.model.Article.find().populate('author');
    this.success(articles);
  }
  async detail() {
    const { ctx } = this;
    const { id } = ctx.params;
    // const article = await ctx.model.Article.find({ _id: id }).populate('author');

    const article = await ctx.model.Article.findOneAndUpdate({ _id: id }, { $inc: { view: 1 } }).populate('author');
    this.success(article);
  }
  async create() {
    const { ctx } = this;
    const { userid } = ctx.state;
    const { content } = ctx.request.body;
    console.log(content);
    const title = content.split('\n').find(v => {
      return v.indexOf('# ') === 0;
    });
    const obj = {
      title: title.replace('# ', ''),
      article: content,
      article_html: marked(content),
      author: userid,
    };
    const res = await ctx.model.Article.create(obj);
    if (res._id) {
      this.success({
        id: res._id,
        title: res.title,
      });
    } else {
      this.error('创建失败');
    }
  }
}

module.exports = ArticleController;
