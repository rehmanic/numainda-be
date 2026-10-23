import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import ngrok from '@ngrok/ngrok';


async function forwardToApp(configService: ConfigService, port: number) {

  const ngrokDomain = configService.get<string>('NGROK_DOMAIN');

  const options: any = {
    addr: port,
    authtoken_from_env: true,
    domain: ngrokDomain
  };

  const forwarder = await ngrok.forward(options);
  console.log(`Available at: ${forwarder.url()}`);
}

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');
  const mode = configService.get<string>('MODE');

  if (mode === 'dev') {
    app.enableCors({
      origin: true,
      credentials: true,
    });
  } else {
    const rawOrigins = configService.get<string>('ALLOWED_ORIGINS');
    const allowedOrigins = rawOrigins
      ? rawOrigins.split(',').map((origin) => origin.trim()).filter(Boolean)
      : [];

    app.enableCors({
      origin: allowedOrigins.length > 0 ? allowedOrigins : false,
      credentials: true,
    });
  }
  
  const config = new DocumentBuilder()
    .setTitle('Numainda')
    .setDescription('The numainda API description')
    .setVersion('1.0')
    .addTag('numainda')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);

  if (mode === "dev") {
    forwardToApp(configService, port);
  }

}

bootstrap();
