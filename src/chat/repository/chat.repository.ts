import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from '../schema/chat.schema';
import { Message, MessageDocument } from '../schema/message.shema';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async createChat(senderId, receiverId) {
    const newChat = new this.chatModel({ members: [senderId, receiverId] });
    await newChat.save();
  }
  async userChats(userId: string) {
    return this.chatModel.find({ members: { $in: [userId] } });
  }
  async findChat(secondId: string, receiverId: string) {
    return this.chatModel.find({ members: { $all: [secondId, receiverId] } });
  }
  async sendMessage(senderId: string, chatId: string, text: string) {
    const newMessage = new this.messageModel({ chatId, senderId, text });
    return newMessage.save();
  }
  async getMessages(chatId: string) {
    return this.messageModel.find({ chatId });
  }
}
