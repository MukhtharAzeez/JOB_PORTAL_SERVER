import { Body, Controller, Query, UseGuards } from '@nestjs/common';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from '../service/chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Post('/')
  async createChat(
    @Body() object: { senderId: string; receiverId: string; type: string },
  ) {
    return this.chatService.createChat(
      object.senderId,
      object.receiverId,
      object.type,
    );
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('/user/:userId/:type')
  async userChats(@Param() object: { userId: string; type: string }) {
    return this.chatService.userChats(object.userId, object.type);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('/find/:senderId/:receiverId')
  async findChat(@Param() object: { senderId: string; receiverId: string }) {
    return this.chatService.findChat(object.senderId, object.receiverId);
  }

  // @UseGuards(AuthGuard('jwt'))
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

  // @UseGuards(AuthGuard('jwt'))
  @Get('/getMessages')
  async getMessages(@Query() object: { chatId: string }) {
    return this.chatService.getMessages(object.chatId);
  }
}
