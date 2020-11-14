'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  const jwt = app.middleware.jwt({ app });
  router.get('/', controller.home.index);
  router.get('/userinfo', controller.user.index);
  router.get('/demoinfo', controller.user.demoinfo);


  router.get('/user/sendcode', controller.user.email);
  router.get('/user/captcha', controller.user.captcha);
  router.post('/user/register', controller.user.create);
  router.post('/user/login', controller.user.login);
  router.get('/user/detail', jwt, controller.user.detail);

  const { isFollow, follow, cancelFollow } = controller.user;
  router.get('/user/follow/:id', jwt, isFollow);
  router.put('/user/follow/:id', jwt, follow);
  router.delete('/user/follow/:id', jwt, cancelFollow);


  router.get('/article', controller.article.index);
  router.get('/article/:id', controller.article.detail);
  router.post('/article/create', jwt, controller.article.create);
};
