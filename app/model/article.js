// eslint-disable-next-line strict
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ArticleSchema = new Schema({
    __v: { type: Number, select: false },
    title: { type: String, required: true },
    article: { type: String, required: true },
    article_html: { type: String, required: true },
    view: { type: Number, required: true, default: 1 },
    author: {
      type: Schema.Types.ObjectId, ref: 'User', required: true,
    },
  }, { timestamps: true });

  return mongoose.model('Article', ArticleSchema);
};

