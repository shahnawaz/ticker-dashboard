import { MarketService } from './market.service';

describe('MarketService', () => {
  it('provides tickers and updates prices', () => {
    const svc = new MarketService();
    svc.onModuleInit();
    expect(svc.getTickers().length).toBeGreaterThan(0);
    const p = svc.getLivePrice('AAPL');
    expect(typeof p).toBe('number');
  });
});
