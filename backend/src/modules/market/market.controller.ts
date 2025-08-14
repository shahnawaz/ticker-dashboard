import { Controller, Get, Param } from '@nestjs/common';
import { MarketService } from './market.service';

@Controller('api')
export class MarketController {
  constructor(private readonly market: MarketService) {}

  @Get('tickers')
  listTickers() {
    return { tickers: this.market.getTickers() };
  }

  @Get('historical/:symbol')
  historical(@Param('symbol') symbol: any) {
    const s = symbol as 'AAPL' | 'TSLA' | 'BTC-USD';
    if (!this.market.getTickers().includes(s)) return { error: 'Unknown symbol' };
    return { symbol: s, series: this.market.getHistory(s) };
  }

  @Get('price/:symbol')
  price(@Param('symbol') symbol: any) {
    const s = symbol as 'AAPL' | 'TSLA' | 'BTC-USD';
    if (!this.market.getTickers().includes(s)) return { error: 'Unknown symbol' };
    return { symbol: s, price: this.market.getLivePrice(s), ts: Date.now() };
  }
}
