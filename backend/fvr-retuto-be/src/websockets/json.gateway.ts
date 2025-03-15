import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import * as fs from 'fs';
import * as path from 'path';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
}) // allow cors for frontend
export class JsonWsGateway 
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
    
  constructor() {
    this.watchJsonFile(); // Start watching the JSON file
  }

  afterInit(server:any){
    console.log('Initialize gateway....');

  }

  // from on GatewayConnection
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    this.server.emit("test send message");
  }

  // from on OnGatewayDisconnect
  handleDisconnect(client: Socket) {
      console.log('Client disconnected:', client.id);
  }

  private watchJsonFile() {
      const btnConfig = path.join(__dirname, '/../../../../src/assets/config/', 'btn-group.json'); // ✅ Path to JSON file
      const walkthroughConfig = path.join(__dirname, '/../../../../src/assets/config/', 'walkthrough.json');;

      fs.watchFile(btnConfig, () => {
          console.log('Updating btn-group config');
          const btnData = fs.readFileSync(btnConfig, 'utf8');
          this.server.emit('btnJsonUpdate', btnData); // ✅ Send update to all clients
      });

      fs.watchFile(walkthroughConfig, () => {
        const walkData = fs.readFileSync(walkthroughConfig, 'utf8');
        console.log('Updating walkthrough config');
        this.server.emit('walkJsonUpdate', walkData); // ✅ Send update to all clients
    });
  }
}

