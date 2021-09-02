# STEP1: 构建基础镜像
FROM alpine:3.14 AS base
# -设置环境变量
ENV APP_PATH=/app
ENV NODE_ENV=development

# -设置工作目录
WORKDIR $APP_PATH
# -安装pm2
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
	&& apk add --no-cache --update \
	nodejs \
	npm \
	yarn \
	g++ \
	make \
	python3 \
	chromium \
	nss \
	freetype \
	harfbuzz \
	ca-certificates \
	ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
	PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# STEP2: 构建依赖镜像
FROM base as installer
# -复制依赖相关目录
COPY package.json .npmrc yarn.lock ./
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
# -添加权限
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
	&& mkdir -p /home/pptruser/Downloads \
	&& chown -R pptruser:pptruser /home/pptruser \
	&& chown -R pptruser:pptruser $APP_PATH

USER pptruser

CMD yarn start:prod
