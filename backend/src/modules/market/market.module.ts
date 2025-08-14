import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { MarketGateway } from './market.ws';

@Module({
  providers: [MarketService, MarketGateway],
  controllers: [MarketController],
})
export class MarketModule {}
