'use strict';

module.exports = appInfo => {
  const config = (exports = {});
  // 日志路径
  config.logger = {
    level: 'NONE',
    dir: `./opt/log/${appInfo.name}/logs`,
  };

  return config;
};
