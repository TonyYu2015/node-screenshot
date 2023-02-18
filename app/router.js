'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/screenshot', controller.screenshot.index);
  router.get('/pdf', controller.screenshot.fakepdf);
  router.get('/download', controller.download.index);

  router.get('/hlapi/*', ( ctx ) => {
    return ctx.response.redirect(`/${ctx.params[0]}${ctx.request.search}`);
  });
};
