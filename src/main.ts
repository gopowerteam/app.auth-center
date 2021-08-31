import { INestApplication } from '@nestjs/common'
import { NestApplication, NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import {
  DocumentBuilder,
  SwaggerModule
} from '@nestjs/swagger'
import { join } from 'path'
import { AppModule } from './app.module'
import { svelteTemplateEngine } from './render/svelte-template-engine'

function setupSwagger(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle('API Document')
    .setDescription('API description')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)
}

function setupViewEngine(app: NestExpressApplication) {
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'))
  app.useStaticAssets(join(__dirname, '..', 'public'))

  app.engine('svelte', svelteTemplateEngine)
  app.setViewEngine('svelte')
}

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule
    )

  // 安装swagger
  setupSwagger(app)
  // 安装ViewEngine
  setupViewEngine(app)

  await app.listen(3000)
}
bootstrap()
