/* eslint-disable prettier/prettier */
import { PostCommentDto } from './../dto/postComment.dto';
import { PostIdDto } from './../dto/postId.dto';
import { UserPostAddDto } from './../dto/userPost.dto';
import { UserPostDocument } from './../schemas/post.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserPosts } from '../schemas/post.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { UserPostCommentDocument, UserPostsComments } from '../schemas/commet.schema';

@Injectable()
export class UserPostRepository {
  constructor(
    @InjectModel(UserPosts.name) private userPostModel: Model<UserPostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserPostsComments.name)
    private userPostCommentsModel: Model<UserPostCommentDocument>,
  ) {}

  // Create a new post
  async addPost(userPostAddDto: UserPostAddDto): Promise<UserPosts> {
    const newPost = await new this.userPostModel(userPostAddDto);
    return newPost.save();
  }

  // Fetch all Posts
  async getAllPosts(): Promise<UserPosts[]> {
    const posts = await this.userPostModel.find({}).populate('user');
    return posts;
  }

  // Like a post
  async likePost(postIdDto: PostIdDto): Promise<boolean> {
    const postId = postIdDto.postId;
    const userId = postIdDto.userId;
    const alreadyLiked = await this.userPostModel.findOne({
      _id: postId,
      likes: { $in: [userId] },
    });
    if (alreadyLiked) {
      await this.userPostModel.updateOne(
        { _id: postId },
        { $pull: { likes: userId } },
      );
      await this.userModel.updateOne(
        { _id: userId },
        { $pull: { likedPosts: postId } },
      );
      return false;
    }

    await this.userPostModel.updateOne(
      { _id: postId },
      { $push: { likes: userId } },
    );
    await this.userModel.updateOne(
      { _id: userId },
      { $push: { likedPosts: postId } },
    );
    return true;
  }

  // Comment a post
  async commentPost(
    postCommentDto: PostCommentDto,
  ): Promise<UserPostsComments> {
    const comments = await this.userPostCommentsModel.create(postCommentDto);
    return comments.save();
  }

  // Get comments of posts
  async getComments(postId: string): Promise<UserPostsComments[]> {
    const comments = await this.userPostCommentsModel.find({postId:postId}).populate('userId');
    return comments
  }
}
