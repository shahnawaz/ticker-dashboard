import { Injectable, OnModuleInit } from '@nestjs/common';

type PricePoint = { ts: number; price: number };
type Series = PricePoint[];
type Symbol = 'AAPL' | 'TSLA' | 'BTC-USD';

@Injectable()
export class MarketService implements OnModuleInit {
  private readonly tickers: Symbol[] = ['AAPL', 'TSLA', 'BTC-USD'];
  private livePrices: Record<Symbol, number> = {
    AAPL: 230,
    TSLA: 210,
    'BTC-USD': 65000,
  };
  private historyCache: Record<Symbol, Series> = {
    AAPL: [], TSLA: [], 'BTC-USD': []
  };
  private interval: NodeJS.Timeout | null = null;
  private listeners: Set<(symbol: Symbol, price: number) => void> = new Set();

  onModuleInit() {
    this.init();
  }

  private init() {
    if (this.interval) return;
    this.interval = setInterval(() => {
      const now = Date.now();
      for (const s of this.tickers) {
        const newPrice = this.jitter(this.livePrices[s], 1.2, 0.04);
        this.livePrices[s] = this.round2(newPrice);
        if (now % 15000 < 1000) {
          this.getHistory(s).push({ ts: now, price: this.livePrices[s] });
          if (this.getHistory(s).length > 2000) this.getHistory(s).shift();
        }
        for (const fn of this.listeners) fn(s, this.livePrices[s]);
      }
    }, 1000);
  }

  getTickers(): Symbol[] { return [...this.tickers]; }
  getLivePrice(symbol: Symbol) { return this.livePrices[symbol]; }

  getHistory(symbol: Symbol): Series {
    if (this.historyCache[symbol].length === 0) {
      const now = Date.now();
      let p = this.livePrices[symbol];
      const series: Series = [];
      for (let i = 300; i >= 1; i--) {
        p = this.jitter(p, 0.5, 0.02);
        series.push({ ts: now - i * 60_000, price: this.round2(p) });
      }
      this.historyCache[symbol] = series;
    }
    return this.historyCache[symbol];
  }

  subscribe(fn: (symbol: Symbol, price: number) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private jitter(p: number, maxStep: number, drift: number) {
    const step = (Math.random() * 2 - 1) * maxStep;
    const driftDir = Math.random() < 0.5 ? -1 : 1;
    return Math.max(0.01, p + step + driftDir * drift);
  }
  private round2(n: number) { return Math.round(n * 100) / 100; }
}
