# egg-node-screenshot

## 部署说明

### port

7100

### 挂载目录

将docker中的`/product`挂载到宿主机中。该目录存储生成后需要长期保存的pdf或图片。

## 接口说明

### 截图

get  /screenshot

#### 参数说明

| 参数名 | 是否必须 | 说明 |
| ------ | ------ | ------ |
| url | 是 | 目标页面地址，需要配置在业务域名中 |
| directly | 否 | 是否直接下载文件，可选值 `0` &verbar; `1` &verbar `2`；1时，直接下载，0时，2时返回可预览地址；res.data.result为下载地址。默认值为0 |
| renderTime | 否 | 请求结束后，等待渲染、动画完成的时间，单位毫秒。默认值0 |
| filename | 否 | 下载后的文件名,不带后缀 |
| type | 否 | 可选值 `pdf` &verbar; `png`。默认值png |
| fakePDF | 否 | type为`pdf`时可用,可选值 `0` &verbar; `1`，为1时，先生成图片，再将图片切割成pdf。默认值0 |
| cacheID | 否 | 缓存ID，配置后启用缓存，缓存命中后直接读取缓存 |
| save | 否 | 是否在服务器上保存文件，可选值 `0` &verbar; `1`；1时，保存。默认值为0 |
| selector | 否 | 页面标记元素的选择器，如果该元素不存在，这表示页面加载异常。 |
| cookie | 否 | 目标页面的cookie，与服务同域名时忽略 |
| token | 否 | 目标页面的X-XSRF-TOKEN，与服务同域名时忽略 |
| debug | 否 | 将页面中的请求写入日志。默认值`0` |
| device | 否 | 设备，默认为空， 设备列表参考下表|
| vpw | 否 | 页面宽度，默认1180|
| vph | 否 | 页面高度，默认650|

#### 设备列表
| 设备名
| ------ 
|Blackberry PlayBook
|Blackberry PlayBook landscape
|BlackBerry Z30
|BlackBerry Z30 landscape
|Galaxy Note 3
|Galaxy Note 3 landscape
|Galaxy Note II
|Galaxy Note II landscape
|Galaxy S III
|Galaxy S III landscape
|Galaxy S5
|Galaxy S5 landscape
|iPad
|iPad landscape
|iPad Mini
|iPad Mini landscape
|iPad Pro
|iPad Pro landscape
|iPhone 4
|iPhone 4 landscape
|iPhone 5
|iPhone 5 landscape
|iPhone 6
|iPhone 6 landscape
|iPhone 6 Plus
|iPhone 6 Plus landscape
|iPhone 7
|iPhone 7 landscape
|iPhone 7 Plus
|iPhone 7 Plus landscape
|iPhone 8
|iPhone 8 landscape
|iPhone 8 Plus
|iPhone 8 Plus landscape
|iPhone SE
|iPhone SE landscape
|iPhone X
|iPhone X landscape
|JioPhone 2
|JioPhone 2 landscape
|Kindle Fire HDX
|Kindle Fire HDX landscape
|LG Optimus L70
|LG Optimus L70 landscape
|Microsoft Lumia 550
|Microsoft Lumia 950
|Microsoft Lumia 950 landscape
|Nexus 10
|Nexus 10 landscape
|Nexus 4
|Nexus 4 landscape
|Nexus 5
|Nexus 5 landscape
|Nexus 5X
|Nexus 5X landscape
|Nexus 6
|Nexus 6 landscape
|Nexus 6P
|Nexus 6P landscape
|Nexus 7
|Nexus 7 landscape
|Nokia Lumia 520
|Nokia Lumia 520 landscape
|Nokia N9
|Nokia N9 landscape
|Pixel 2
|Pixel 2 landscape
|Pixel 2 XL
|Pixel 2 XL landscape

### 下载pdf

get  /pdf
生成由图片转成的PDF

#### 参数说明

在/screenshot接口的基础上，将fakePDF的默认值改为`1`


### 下载文件

get  /download

#### 参数说明

| 参数名 | 是否必须 | 说明 |
| ------ | ------ | ------ |
| raw | 是 | 服务器上的文件名 |
| filename | 否 | 下载后的文件名 |

### 订阅邮件下载链接

get  /subscribe
基于截图链接，修改入参`type='pdf'，direct='1'`,并根据参数category获取url

#### 参数说明

| 参数名 | 是否必须 | 说明 |
| ------ | ------ | ------ |
| category | 否 | 默认值`talentQuality` |


### header说明

访问目标页面时，目前仅带上request中的cookie及X-XSRF-TOKEN。

### 缓存说明

通过url、cacheID、cookie，生成缓存名。缓存存在docker容器中的`/tmp`文件夹中，重启后失效。
save值为`1`时，存在`/product/文件夹中`

### todos

- 视窗大小
- 并发
- 鉴权
- 缓存回收
- 内网域名预解析
