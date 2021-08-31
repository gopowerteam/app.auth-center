# STEP1: 构建基础镜像
FROM alpine:3.14 AS base
# -设置环境变量
ENV APP_PATH=/app
ENV NODE_ENV=development
# -设置工作目录
WORKDIR $APP_PATH
# -安装pm2
RUN  sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
	&& apk add --no-cache --update nodejs=14.17.4-r0 yarn=1.22.10-r0 \
	&& yarn global add pm2


# STEP2: 构建依赖镜像
FROM base as installer
# -复制依赖相关目录
COPY package.json .npmrc ./
# -安装依赖
RUN yarn


# STEP3: 构建运行镜像
FROM base as builder
# -复制依赖文件
COPY --from=installer $APP_PATH/node_modules ./node_modules
# -复制代码文件
COPY . .
# -运行编译
RUN yarn build 
CMD yarn start:prod
