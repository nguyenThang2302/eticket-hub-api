import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
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

  @SubscribeMessage('sendNotification')
  handleSendNotification(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Received notification:`, data);
    this.server.emit('receiveNotification', data); // Broadcast to all clients
  }

  sendNotificationToUser(userId: string, message: string) {
    for (const [clientId, socket] of this.connectedClients) {
      if (socket.handshake.auth.userId === userId) {
        socket.emit('receiveNotification', { message });
      }
    }
  }
}
