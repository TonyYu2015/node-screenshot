# FROM node:8.11.3
FROM docker.ifchange.com/app/nodescreen-8.11.3:v1

# RUN cd /bin && ln -sf bash /bin/sh

# dumb-init
RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64.deb
RUN dpkg -i dumb-init_*.deb

# # node-canvas依赖
# RUN apt-get update \
#     && apt-get install -qq libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential librsvg2-dev g++ 

# # puppeteer依赖
# RUN apt-get update && \
#     apt-get -y install xvfb gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
#       libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 \
#       libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
#       libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 \
#       libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget fontconfig && \
#     rm -rf /var/lib/apt/lists/*
COPY './fonts' '/usr/share/fonts'
WORKDIR /app

COPY 'package.json' './package.json'

COPY 'package-lock.json' './package-lock.json'

RUN npm config set puppeteer_download_host=https://npm.taobao.org/mirrors

RUN npm i

COPY . ./
# Add user so we don't need --no-sandbox.
# RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
#     && mkdir -p /home/pptruser/Downloads \
#     && chown -R pptruser:pptruser /home/pptruser

# Run everything after as non-privileged user.

EXPOSE 7100

# ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD /usr/bin/dumb-init npm run docker-start

# USER pptruser
