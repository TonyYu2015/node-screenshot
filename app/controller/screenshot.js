'use strict';

const Controller = require('egg').Controller;
class ScreenshotController extends Controller {
  async index() {
    const {
      url,
      cookie,
      filename,
      type = 'png',
      cacheID,
      fakePDF,
      directly = '0',
      token,
      save = '0',
      renderTime,
      selector,
      device,
      vpw,
      vph
    } = this.ctx.query;

    await this.ctx.service.screenshot.generate({
      url,
      cookie,
      filename,
      type,
      cacheID,
      fakePDF,
      directly,
      token,
      save,
      renderTime,
      selector,
      device,
      vpw,
      vph
    });
  }
  async fakepdf() {
    const {
      url,
      cookie,
      filename,
      type = 'pdf',
      cacheID,
      fakePDF = '1',
      directly = '0',
      token,
      save = '0',
      renderTime,
      selector,
    } = this.ctx.query;

    await this.ctx.service.screenshot.generate({
      url,
      cookie,
      filename,
      type,
      cacheID,
      fakePDF,
      directly,
      token,
      save,
      renderTime,
      selector,
    });
  }
}

module.exports = ScreenshotController;
