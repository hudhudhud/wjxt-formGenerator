#### Build Setup
``` bash
# 配置镜像加速
https://www.ydyno.com/archives/1219.html
或者镜像全家桶(常用的全部加速了)
npm i -g mirror-config-china --registry=https://registry.npm.taobao.org

# 安装依赖
npm install

# 启动服务 localhost:8013
npm run serve

# 构建生产环境
npm run build
```

#### 常见问题

1、linux 系统在安装依赖的时候会出现 node-sass 无法安装的问题

解决方案：
```
1. 单独安装：npm install --unsafe-perm node-sass 
2. 直接使用：npm install --unsafe-perm
```

2、加速node-sass安装

https://www.ydyno.com/archives/1219.html










