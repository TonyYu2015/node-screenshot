#!/usr/bin/dumb-init /bin/sh
env=$1

if [ $env == 'test' ];then
    echo '10.9.10.2 mp.weixin.qq.com iva.testing2.chengdan.ai greentown.testing2.ifchange.com www.testing2.ifchange.com micro-img.testing2.ifchange.com zhaogong.testing2.ifchange.com img.testing2.ifchange.com img1.testing2.ifchange.com img2.testing2.ifchange.com img3.testing2.ifchange.com img4.testing2.ifchange.com img5.testing2.ifchange.com new-img.testing.ifchange.com new-img1.testing.ifchange.com new-img2.testing.ifchange.com new-img3.testing.ifchange.com new-img4.testing.ifchange.com new-img5.testing.ifchange.com www.testing2.chengdan.ai img-customize.testing2.ifchange.com img-customize1.testing2.ifchange.com img-customize2.testing2.ifchange.com img-customize3.testing2.ifchange.com img-customize4.testing2.ifchange.com uimg.testing2.ifchange.com dtr.testing2.ifchange.com dtr-img.testing2.ifchange.com talentreview.testing2.ifchange.com seekers.testing2.cheng95.cn g.testing2.cheng95.com uimg.testing2.cheng95.com zoomlion.testing2.ifchange.com new-img-customize.testing.ifchange.com new-img-customize1.testing.ifchange.com new-img-customize2.testing.ifchange.com new-img-customize3.testing.ifchange.com new-img-customize4.testing.ifchange.com gt.testing2.ifchange.com img-newcustomize.testing2.ifchange.com iflytek2.testing2.ifchange.com' >> /etc/hosts

elif [ $env == 'pro' ];then
    echo '192.168.8.4 www.ifchange.com zhaogong.ifchange.com greentown.ifchange.com dtr.ifchange.com zoomlion.ifchange.com gt.ifchange.com iflytek2.ifchange.com' >> /etc/hosts

    echo '192.168.8.2 micro-img.ifchange.com new-img-customize.ifchange.com new-img-customize1.ifchange.com new-img-customize2.ifchange.com new-img-customize3.ifchange.com new-img-customize4.ifchange.com uimg.cheng95.com talentreview.ifchange.com www.chengdan.ai img.ifchange.com img1.ifchange.com img2.ifchange.com img3.ifchange.com img4.ifchange.com img5.ifchange.com new-img.ifchange.com new-img1.ifchange.com new-img2.ifchange.com new-img3.ifchange.com new-img4.ifchange.com new-img5.ifchange.com img-customize.ifchange.com img-customize1.ifchange.com img-customize2.ifchange.com img-customize3.ifchange.com img-customize4.ifchange.com uimg.ifchange.com dtr-img.ifchange.com img-newcustomize.ifchange.com' >> /etc/hosts

    echo '192.168.8.13 iva.ifchange.com' >> /etc/hosts

    echo '192.168.11.27 seekers.cheng95.cn g.cheng95.com' >> /etc/hosts
    env=prod
fi

export EGG_SERVER_ENV=$env

npm run docker-start
