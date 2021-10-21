'use strict';

const Service = require('egg').Service;
const puppeteer = require('puppeteer');
const DEVICES = require('puppeteer/DeviceDescriptors');
const { URL } = require('url');
const whitelist = require('../src/whitelist');
const fs = require('fs-extra');
const checkDirExist = require('../src/utils/checkDirExist.js');
const path = require('path');
const mime = require('mime');
const md5 = require('md5');
const uuidv1 = require('uuid/v1');
const image2pdf = require('../src/image2pdf');
const stream = require('stream');
const cookieTool = require('cookie');

let browser = null;

// 进程推出时关闭浏览器
process.on('exit', function() {
  browser && browser.close();
});

// const closeBrowserTimer = null;
class ScreenshotService extends Service {
  async generate({
    url,
    cookie,
    filename,
    type = 'png',
    cacheID,
    save = '0',
    fakePDF,
    directly = '0',
    renderTime,
    token,
    selector,
    debug = '0',
    device,
    vpw,
    vph
  }) {
    debug = debug === '1';
    console.time('总耗时');
    if (!/^http/.test(url)) {
      url = 'http://' + url;
    }
    console.log('url===', url);
    if (!checkURL(url)) {
      this.ctx.status = 500;
      this.ctx.body = 'url不合法';
      return;
    }
    cookie = cookie || this.ctx.request.header.cookie || '';
    const headers = {
      cookie,
      'X-XSRF-TOKEN':
        token || this.ctx.request.header['X-XSRF-TOKEN'] || 'undefined', // 测试用token',
    };

    // 获取截屏数据
    let result;
    let hasCache = false;
    if (cacheID) {
      result = await getCache({ url, cacheID, cookie, type, filename, save });
    }
    if (!result) {
      result = await this.surfing({
        url,
        headers,
        type,
        filename,
        fakePDF,
        renderTime,
        selector,
        debug,
        device,
        vpw,
        vph
      }).catch(err => {
        this.ctx.logger.info(err.toString && err.toString());
        this.ctx.body = (err.toString && err.toString()) || '生成失败';
        this.ctx.status = 500;
        return null;
      });
      if (!result) {
        return;
      }
    } else {
      hasCache = true;
    }

    if (result) {
      const { filename, data } = result;
      // 缓存
      let cachePromise;
      if (cacheID && !hasCache) {
        cachePromise = setCache({ url, cacheID, cookie, type, data, save });
      }
      // 使用已命中的缓存
      if (hasCache) {
        cachePromise = Promise.resolve(result.storeName);
      }
      // 返回结果
      if (directly === '1') {
        // 直接下载
        this.ctx.set('content-type', mime.getType(filename));
        this.ctx.set(
          'content-disposition',
          `Attachment;filename*=UTF-8''${encodeURIComponent(filename)}`
        );
        this.ctx.body = data;
      } else {
        // 返回下载地址
        const localFile = await (cachePromise ||
          setCache({ url, cacheID: uuidv1(), cookie, type, data, save }));
        // 截取文件名
        let filenameWithoutExtension = '';
        if (filename) {
          const matchResult = filename.match(/.*(?=\.{1}[a-z]{1,}$)/);
          filenameWithoutExtension = matchResult ? matchResult[0] : filename;
        }
        const fileurl = `${this.ctx.request.header.host}/hlapi/download?raw=${localFile}${
          filenameWithoutExtension ? `&filename=${encodeURIComponent(filenameWithoutExtension)}` : ''
        }${directly === '2' ? '&preview=1' : ''}`;
        this.ctx.body = { err_no: 0, err_msg: '', results: fileurl };
      }
    } else {
      this.ctx.body = '未获得远程数据，生成失败';
      this.ctx.status = 500;
    }
    console.timeEnd('总耗时');
  }
  // 爬虫
  async surfing({
    url,
    headers,
    selector,
    type,
    filename,
    fakePDF,
    renderTime,
    debug,
    device,
    vpw = 1180,
    vph = 675
  }) {
    try {
      // 获取远端数据
      console.time('获取远端数据');
      console.log('目标页面地址', url);
      if (!browser) {
        browser = await puppeteer.launch({
          args: [
            '--single-process',
            '--disable-gpu',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
            '–no-zygote',
            '--disable-dev-shm-usage', // docker的share memory只有64MB
          ],
        });
        // closeBrowserTimer && clearTimeout(closeBrowserTimer);
        // closeBrowserTimer = setTimeout(() => {
        //   browser.pages().then(pages => pages.length === 0 && browser.close());
        // }, 60000);
      }
      const page = (await browser.pages())[0] || (await browser.newPage());

      let { cookie, ...resetHeaders } = headers;
      // 统计未完成请求
      const requestArray = [];
      page.on('request', request => {
        requestArray.push(request._url);
      });
      page.on('requestfailed', request => {
        this.ctx.logger.warn(
          `requestFailed ${request.url()} ${request.failure().errorText}`
        );
      });
      page.on('requestfinished', request => {
        if (debug) {
          this.ctx.logger.debug(
            `requestfinished ${request.url()} ${request.response.text()}`
          );
        }
        requestArray.splice(requestArray.indexOf(request._url), 1);
      });
      // 删除浏览器内可能存在的cookie
      await page.cookies(url).then(async cookies => {
        if (cookies.length > 0) {
          await page.deleteCookie(...cookies);
        }
      });
      if (cookie) {
        const cookies = [];
        cookie = cookieTool.parse(headers.cookie);
        for (const key in cookie) {
          if (cookie.hasOwnProperty(key)) {
            cookies.push({
              name: key,
              value: encodeURIComponent(cookie[key]),
              expires: Date.now() + 1000 * 60,
              url,
            });
            if (key === 'tob_csrf_token') {
              resetHeaders['X-XSRF-TOKEN'] = cookie[key];
            }
          }
        }
        cookies.length > 0 && (await page.setCookie(...cookies));
      }
      await page.setExtraHTTPHeaders({
        ...resetHeaders,
      });

      // 设置设备
      device = DEVICES[device];
      device && await page.emulate(device);
      vpw = vpw * 1;
      vph = vph * 1;
      vpw && vph && await page.setViewport({ width: vpw, height: vph });
      // todo 超时数、长轮询接口数
      const timeout = 1000 * 30;
      const maxPandingRequest = 1;
      page.goto(url, { timeout: timeout * 2 });
      await Promise.race([
        await page.waitForNavigation({ timeout }).catch(() => {
          if (requestArray.length >= maxPandingRequest + 1) {
            page.close();
            throw Error('访问目标页面超时');
          }
        }),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
      ]);
      renderTime !== '0' &&
        !Number.isNaN(renderTime) &&
        (await page.waitFor(Number(renderTime)));
      if (selector) {
        await page.waitForSelector(selector); // 页面完整渲染后添加的标记;
      }
      console.timeEnd('获取远端数据');
      let result = null;
      console.time('截图');
      switch (type) {
        case 'pdf':
          result = {
            data:
              fakePDF === '1'
                ? await image2pdf({
                  src: await page.screenshot({ fullPage: true }),
                })
                : await page.pdf({ printBackground: true, format: 'A4' }),
            filename: `${filename || 'document'}.pdf`,
          };
          break;
        default: {
          result = {
            data: await page.screenshot({ fullPage: true }),
            filename: `${filename || 'image'}.png`,
          };
          break;
        }
      }
      console.timeEnd('截图');
      await page.close();
      if (!result) {
        throw new Error('未成功生成');
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}

// 检查目标域名是否为配置中的业务域名
function checkURL(url) {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  url = new URL(url);
  return whitelist.includes(url.hostname);
}

// 获取缓存
function getCache({ url, cacheID, cookie, type, filename, save }) {
  const storeName = gerneateStoreName({ url, cacheID, cookie, type, save });
  const tmpDir = path.resolve(__dirname, `../../tmp/${storeName}`);
  const saveDir = path.resolve(__dirname, `../../product/${storeName}`);
  let validDir = '';
  if (checkDirExist(saveDir)) {
    validDir = saveDir;
  } else if (checkDirExist(tmpDir)) {
    validDir = tmpDir;
  }
  if (validDir) {
    return {
      data: fs.createReadStream(validDir),
      filename: filename ? `${filename}.${type}` : storeName,
      storeName,
    };
  }
  return null;
}

// 新建缓存文件
function setCache({ url, cacheID, cookie, type, data, save }) {
  const storeName = gerneateStoreName({ url, cacheID, cookie, type, save });
  const fileDir = path.resolve(
    __dirname,
    `../../${save === '1' ? 'product' : 'tmp'}/${storeName}`
  );
  fs.ensureFileSync(fileDir);
  return new Promise(resolve => {
    if (data instanceof Buffer) {
      fs.writeFile(fileDir, data, () => resolve(storeName));
    } else if (data instanceof stream.Readable) {
      const writableStream = fs.createWriteStream(fileDir);
      data.pipe(writableStream);
      writableStream.on('close', () => resolve(storeName));
    }
  });
}

// 通过特定参数，获取实际存储名字
function gerneateStoreName({ url, cacheID, cookie, type, save }) {
  return md5(`${url}${cacheID}`) + md5(cookie).slice(0, 6) + save + `.${type}`;
}
module.exports = ScreenshotService;
