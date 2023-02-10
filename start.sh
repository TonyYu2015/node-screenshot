#!/usr/bin/dumb-init /bin/sh
env=$1

if [ $env == 'test' ];then
    echo '10.9.10.2 mp.weixin.qq.com ' >> /etc/hosts

elif [ $env == 'pro' ];then
    echo '192.168.8.4 ' >> /etc/hosts

    env=prod
fi

export EGG_SERVER_ENV=$env

npm run docker-start
