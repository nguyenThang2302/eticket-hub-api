import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust this based on your frontend domain
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private connectedClients = new Map<string, Socket>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  sendNotification(userId: string, payload: any) {
    this.server.to(userId).emit('notification', payload);
  }

  @SubscribeMessage('subscribeToNotifications')
  handleSubscribe(client: Socket, userId: string) {
    client.join(userId); // Join room by userId
  }
}
