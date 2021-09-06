import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import {
  DocumentBuilder,
  SwaggerModule
} from '@nestjs/swagger'
import { join } from 'path'
import { AppModule } from './app.module'
import * as svelteViewEngine from 'svelte-view-engine'

function setupSwagger(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle('API Document')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('app')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)
}

function setupViewEngine(app: NestExpressApplication) {
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'))
  app.useStaticAssets(join(__dirname, '..', 'public'))

  const engine = svelteViewEngine({
    env: 'dev',
    template: './public/template/index.html',
    dir: './src/views',
    type: 'svelte',
    buildDir: './.temp/view',
    liveReload: true
  })

  app.engine(engine.type, engine.render)
  app.set('view engine', engine.type)
  app.set('views', engine.dir)
}

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
      {
        cors: true
      }
    )
  // 安装swagger
  setupSwagger(app)
  // 安装ViewEngine
  setupViewEngine(app)

  await app.listen(3000)
}

bootstrap()
