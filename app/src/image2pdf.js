'use strict';
const { createCanvas, loadImage } = require('canvas');

// a4尺寸 595×842
async function image2pdf({ src }) {
  console.time('图片转pdf');
  const pageWidth = 1180;
  const pageHeight = (842 / 595) * 1180;
  const canvas = createCanvas(pageWidth, pageHeight, 'pdf');
  return loadImage(src).then(img => {
    const ctx = canvas.getContext('2d');
    // ctx.patternQuality = 'nearest';
    // ctx.quality = 'nearest';
    const rate = pageWidth / img.width;
    const pages = Math.ceil((img.height * rate) / pageHeight);
    for (let index = 0, restScrollHeight = img.height; index < pages; index++) {
      if (index > 0) {
        ctx.addPage();
      }
      let sHeight = pageHeight / rate;
      if (sHeight > restScrollHeight) {
        sHeight = restScrollHeight;
      }
      restScrollHeight -= sHeight;
      // ctx.drawImage(
      //   img,
      //   0, // sx
      //   0 // sy
      // );
      // return canvas.createPNGStream({ compressionLevel: 0 });
      ctx.drawImage(
        img,
        0, // sx
        (index * pageHeight) / rate, // sy
        img.width, // sWidth
        sHeight, // sWidth
        0, // dx
        0, // dy
        pageWidth, // dWidth
        sHeight * rate // dHeight
      );
    }
    console.timeEnd('图片转pdf');
    return canvas.createPDFStream();
  });
}

module.exports = image2pdf;
