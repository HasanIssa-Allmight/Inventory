import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('proto path:', join(process.cwd(), 'inventory.proto'));
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'inventory',
        protoPath: join(process.cwd(), 'inventory.proto'),
          loader: {
            keepCase: true,
          },
        url: '0.0.0.0:50051',
      },
    },
  );
  await app.listen();
}
bootstrap();