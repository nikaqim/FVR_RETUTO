import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JsonWsGateway } from './json-ws/json-ws.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, JsonWsGateway],
})
export class AppModule {}
