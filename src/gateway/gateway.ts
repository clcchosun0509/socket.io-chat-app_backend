import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true
  },
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(client: any, ...args: any[]) {
    // console.log("client", client);
  }
  handleDisconnect(client: any) {
    // throw new Error('Method not implemented.');
  }
}