import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8400, { cors: '*' })
export class VideoCallGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    console.log('connected to new', socket.id);
    socket.emit('me', socket.id);
    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
      socket
        .to(userToCall)
        .emit('callUser', { signal: signalData, from, name });
    });
    socket.on('answerCall', (data) => {
      socket.to(data.to).emit('callAccepted', data.signal);
    });
  }

  async handleDisconnect(socket: Socket) {
    socket.broadcast.emit('Call ended');
  }
}
