import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8000, { cors: '*' })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  activeUser: any[] = [];

  async getUser(userId) {
    return this.activeUser.find((user) => user.userId == userId);
  }

  async handleConnection(socket: Socket) {
    socket.on('new-user-add', (newUserId: string) => {
      if (!this.activeUser.some((user) => user.userId === newUserId)) {
        this.activeUser.push({
          userId: newUserId,
          socketId: socket.id,
        });
      }
    });
    socket.emit('get-user', this.activeUser);
    socket.on('send-message', (data: any) => {
      const { receiverId } = data;
      const user = this.activeUser.find((user) => user.userId === receiverId);
      if (user) {
        socket.to(user.socketId).emit('receive-message', data);
      }
    });
  }

  async handleDisconnect(socket: Socket) {
    this.activeUser = this.activeUser.filter(
      (user) => user.socketId !== socket.id,
    );
    socket.emit('get-user', this.activeUser);
  }
}
