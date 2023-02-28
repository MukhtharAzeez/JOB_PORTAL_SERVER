import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from '../schema/chat.schema';
import { Message, MessageDocument } from '../schema/message.shema';
import {
  Notification,
  NotificationDocument,
} from '../schema/notification.schema';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async createChat(senderId: string, receiverId: string, type: string) {
    const alreadyExist = await this.chatModel.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (alreadyExist) return alreadyExist;
    const newChat = new this.chatModel({
      members: [senderId, receiverId],
      type,
    });
    return newChat.save();
  }
  async userChats(userId: string, type: string) {
    return this.chatModel
      .find({ members: { $in: [userId] }, type: type })
      .sort({ updatedAt: -1 });
  }
  async findChat(secondId: string, receiverId: string) {
    return this.chatModel.find({ members: { $all: [secondId, receiverId] } });
  }
  async sendMessage(senderId: string, chatId: string, text: string) {
    const newMessage = new this.messageModel({ chatId, senderId, text });
    await this.chatModel.updateOne(
      { _id: chatId },
      {
        $set: {
          updatedAt: Date.now(),
          lastMessage: text,
        },
        $push: {
          unSeenMessages: {
            text: text,
            sender: senderId,
          },
        },
      },
    );
    return newMessage.save();
  }
  async getMessages(chatId: string) {
    await this.chatModel.updateOne(
      { _id: chatId },
      {
        $set: {
          unSeenMessages: [],
        },
      },
    );
    return this.messageModel.find({ chatId });
  }
  async sendNotification(
    content: string,
    receiverId: string,
  ): Promise<boolean> {
    const newNotification = new this.notificationModel({
      content: content,
      receiver: receiverId,
    });
    await newNotification.save();
    return true;
  }
}
