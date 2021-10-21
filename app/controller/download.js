'use strict';

const Controller = require('egg').Controller;
const checkDirExist = require('../src/utils/checkDirExist.js');
const path = require('path');
const fs = require('fs-extra');
const mime = require('mime');

class DownloadController extends Controller {
  async index() {
    const { raw, filename, preview } = this.ctx.query;
    const result = await getFile({ raw, filename });

    if (result) {
      const contentType = mime.getType(raw);
      this.ctx.set('content-type', contentType);

      // 预览时不设置下载头
      if (!preview) {
        const filenameOfHeader = encodeURIComponent(
          (filename || raw.split('.')[0]) + '.' + mime.getExtension(contentType)
        );
        this.ctx.set(
          'content-disposition',
          `Attachment;filename*=UTF-8''${filenameOfHeader}`
        );
      }

      this.ctx.body = result;
    }
  }
}

// 获取本地文件
function getFile({ raw }) {
  const tmpDir = path.resolve(__dirname, `../../tmp/${raw}`);
  const saveDir = path.resolve(__dirname, `../../product/${raw}`);
  if (checkDirExist(tmpDir)) {
    return fs.createReadStream(tmpDir);
  } else if (checkDirExist(saveDir)) {
    return fs.createReadStream(saveDir);
  }
  return null;
}
module.exports = DownloadController;
