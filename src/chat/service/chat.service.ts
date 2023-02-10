import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../repository/chat.repository';

@Injectable()
export class ChatService {
  constructor(private chatRepository: ChatRepository) {}

  async createChat(senderId: string, receiverId: string, type: string) {
    return this.chatRepository.createChat(senderId, receiverId, type);
  }
  async userChats(userId: string, type: string) {
    return this.chatRepository.userChats(userId, type);
  }
  async findChat(senderId: string, receiverId: string) {
    return this.chatRepository.findChat(senderId, receiverId);
  }
  async sendMessage(senderId: string, chatId: string, text: string) {
    return this.chatRepository.sendMessage(senderId, chatId, text);
  }
  async getMessages(chatId: string) {
    return this.chatRepository.getMessages(chatId);
  }
}
