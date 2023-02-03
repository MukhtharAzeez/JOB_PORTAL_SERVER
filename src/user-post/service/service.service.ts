import { PostCommentDto } from './../dto/postComment.dto';
import { PostIdDto } from './../dto/postId.dto';
import { UserPosts } from './../schemas/post.schema';
import { UserPostAddDto } from './../dto/userPost.dto';
import { Injectable } from '@nestjs/common';
import { UserPostRepository } from '../respositories/post.repository';
import { UserPostsComments } from '../schemas/commet.schema';

@Injectable()
export class UserPostService {
  constructor(private readonly userPostRepository: UserPostRepository) {}

  async addPost(userPostAddDto: UserPostAddDto): Promise<UserPosts> {
    return this.userPostRepository.addPost(userPostAddDto);
  }

  async getAllPosts(limit: number, skip: number): Promise<UserPosts[]> {
    return this.userPostRepository.getAllPosts(limit, skip);
  }

  async likePost(postIdDto: PostIdDto): Promise<boolean> {
    return this.userPostRepository.likePost(postIdDto);
  }

  async commentPost(
    postCommentDto: PostCommentDto,
  ): Promise<UserPostsComments> {
    return this.userPostRepository.commentPost(postCommentDto);
  }

  async getComments(postId: string): Promise<UserPostsComments[]> {
    return this.userPostRepository.getComments(postId);
  }

  async likeAComment(commentId: string, userId: string): Promise<boolean> {
    return this.userPostRepository.likeAComment(commentId, userId);
  }
}
