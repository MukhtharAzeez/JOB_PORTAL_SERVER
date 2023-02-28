import { UserPostsComments } from './../schemas/commet.schema';
import { UserPostService } from './../service/service.service';
import { UserPostAddDto } from './../dto/userPost.dto';
import { UserPosts } from './../schemas/post.schema';
import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Query, UseGuards } from '@nestjs/common/decorators';
import { PostIdDto } from '../dto/postId.dto';
import { PostCommentDto } from '../dto/postComment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('userPost')
export class ControllerController {
  constructor(
    private userPostService: UserPostService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/addPost')
  @UsePipes(ValidationPipe)
  async addPost(@Body() userPostAddDto: UserPostAddDto): Promise<UserPosts> {
    return this.userPostService.addPost(userPostAddDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getPosts')
  async getAllPosts(
    @Query() object: { limit: number; skip: number },
  ): Promise<UserPosts[]> {
    return this.userPostService.getAllPosts(object.limit, object.skip);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/like')
  async likeAPost(@Query() postIdDto: PostIdDto): Promise<boolean> {
    return this.userPostService.likePost(postIdDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/comment')
  async commentAPost(
    @Body() postCommentDto: PostCommentDto,
  ): Promise<UserPostsComments> {
    return this.userPostService.commentPost(postCommentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getComments')
  async getComments(
    @Query() object: { postId: string },
  ): Promise<UserPostsComments[]> {
    return this.userPostService.getComments(object.postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/likeAComment')
  async likeAComment(
    @Query() object: { commentId: string; userId: string },
  ): Promise<boolean> {
    return this.userPostService.likeAComment(object.commentId, object.userId);
  }
}
