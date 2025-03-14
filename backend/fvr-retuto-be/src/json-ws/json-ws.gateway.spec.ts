import { Test, TestingModule } from '@nestjs/testing';
import { JsonWsGateway } from './json-ws.gateway';

describe('JsonWsGateway', () => {
  let gateway: JsonWsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonWsGateway],
    }).compile();

    gateway = module.get<JsonWsGateway>(JsonWsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
