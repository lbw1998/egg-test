// eslint-disable-next-line strict
module.exports = ({ app }) => {
  return async function verify(ctx, next) {
    const token = ctx.request.header.authorization.replace('Bearer ', '');
    try {
      const res = await app.jwt.verify(token, app.config.jwt.secret);
      console.log(res);
      ctx.state.email = res.email;
      ctx.state.userid = res.id;
      await next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        ctx.state.email = '';
        ctx.state.userid = '';
        // eslint-disable-next-line no-return-assign
        return ctx.body = {
          code: 403,
          message: 'token过期',
        };
      }
    }
  };
};
