import { Body, Controller, Query } from '@nestjs/common';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { ChatService } from '../service/chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('/')
  async createChat(@Body() object: { senderId: string; receiverId; string }) {
    return this.chatService.createChat(object.senderId, object.receiverId);
  }
  @Get('/user/:userId')
  async userChats(@Param() object: { userId: string }) {
    return this.chatService.userChats(object.userId);
  }
  @Get('/find/:senderId/:receiverId')
  async findChat(@Param() object: { senderId: string; receiverId: string }) {
    return this.chatService.findChat(object.senderId, object.receiverId);
  }

  @Post('/sendMessage')
  async sendMessage(
    @Body() object: { senderId: string; chatId: string; text: string },
  ) {
    return this.chatService.sendMessage(
      object.senderId,
      object.chatId,
      object.text,
    );
  }

  @Get('/getMessages')
  async getMessages(@Query() object: { chatId: string }) {
    return this.chatService.getMessages(object.chatId);
  }
}
