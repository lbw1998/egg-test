// eslint-disable-next-line strict
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    __v: { type: Number, select: false },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    nickname: { type: String, required: true },
    following: {
      type: [{ type: Schema.Types.ObjectId }, { ref: 'User' }],
    },
  }, { timestamps: true });
  return mongoose.model('User', UserSchema);
};
