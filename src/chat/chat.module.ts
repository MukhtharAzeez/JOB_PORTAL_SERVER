import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ChatController } from './controller/chat.controller';
import { ChatRepository } from './repository/chat.repository';
import { ChatService } from './service/chat.service';
import { Chat, ChatSchema } from './schema/chat.schema';
import { Message, MessageSchema } from './schema/message.shema';
import { Notification, NotificationSchema } from './schema/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository],
})
export class ChatModule {}
