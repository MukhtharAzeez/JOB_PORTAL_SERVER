import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../repository/chat.repository';

@Injectable()
export class ChatService {
  constructor(private chatRepository: ChatRepository) {}

  async createChat(senderId, receiverId) {
    return this.chatRepository.createChat(senderId, receiverId);
  }
  async userChats(userId: string) {
    return this.chatRepository.userChats(userId);
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
