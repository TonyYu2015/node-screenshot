'use strict';
const Controller = require('egg').Controller;
// 订阅下载链接生成
class SubscribeController extends Controller {
  async index() {
    let {
      category = 'talentQuality',
      cookie,
      filename,
      type = 'pdf',
      cacheID,
      fakePDF = '1',
      directly = '1',
      token,
      save = '1',
      renderTime,
      selector,
      userToken,
    } = this.ctx.query;
    cacheID = cacheID || userToken;
    const url = this.generatePageURL(category, userToken);
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
  generatePageURL(category, userToken) {
    if (category === 'talentQuality') {
      return `${this.ctx.request.header.host}/talent-quality?pdfPreview=1&token=${userToken}`;
    }
  }
}

module.exports = SubscribeController;
