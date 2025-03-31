import { Module } from '@nestjs/common';
import { JsonWsGateway } from './json.gateway';

@Module({
    providers: [JsonWsGateway]
})
export class WebsocketsModule {}
