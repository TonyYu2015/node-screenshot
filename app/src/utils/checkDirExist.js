'use strict';
const fs = require('fs-extra');
module.exports = function checkDirExist(path) {
  try {
    return fs.statSync(path);
  } catch (e) {
    if (e.code === 'ENOENT') { // no such file or directory. File really does not exist
      return false;
    }
    throw e; // something else went wrong, we don't have rights, ...
  }
};
