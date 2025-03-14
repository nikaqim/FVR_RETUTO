import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import * as fs from 'fs';
import * as path from 'path';

@WebSocketGateway(8080, { cors: { origin: '*' } }) // allow cors for frontend
export class JsonWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
    
  constructor() {
    console.log('WebSocket Gateway Initialized'); // ✅ Add Log
    this.watchJsonFile(); // Start watching the JSON file
  }

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
    this.server.emit("test send message");
  }

  handleDisconnect(client: any) {
      console.log('Client disconnected:', client.id);
  }

  private watchJsonFile() {
      const btnConfig = path.join(__dirname, '/../../../../src/assets/config/', 'btn-group.json'); // ✅ Path to JSON file
      const walkthroughConfig = path.join(__dirname, '/../../../../src/assets/config/', 'walkthrough.json');;

      console.log("btnConfig:",btnConfig);
      console.log("walkthroughConfig:",walkthroughConfig);

      fs.watchFile(btnConfig, () => {
          console.log('Btn JSON file updated, sending updates to clients...');
          const btnData = fs.readFileSync(btnConfig, 'utf8');
          this.server.emit('btnJsonUpdate', JSON.parse(btnData)); // ✅ Send update to all clients
      });

      fs.watchFile(walkthroughConfig, () => {
        console.log('Walk JSON file updated, sending updates to clients...');
        const walkData = fs.readFileSync(walkthroughConfig, 'utf8');
        this.server.emit('walkJsonUpdate', JSON.parse(walkData)); // ✅ Send update to all clients
    });
  }
}
