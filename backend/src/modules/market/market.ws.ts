import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import { MarketService } from './market.service';

@WebSocketGateway({ path: '/ws' })
export class MarketGateway implements OnModuleInit {
  @WebSocketServer() server!: Server;

  constructor(private readonly market: MarketService) {}

  onModuleInit() {
    this.market.subscribe((symbol, price) => {
      const payload = JSON.stringify({ type: 'price', symbol, price, ts: Date.now() });
      this.server.clients.forEach(client => {
        if (client.readyState === 1 /* OPEN */) client.send(payload);
      });
    });
  }
}
