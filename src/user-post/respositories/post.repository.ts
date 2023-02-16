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
import {
  UserPostCommentDocument,
  UserPostsComments,
} from '../schemas/commet.schema';

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
  async getAllPosts(limit:number, skip:number): Promise<UserPosts[]> {
    const posts = await this.userPostModel
      .find({})
      .skip(skip * limit)
      .limit(limit)
      .populate(
        'user',
        '-password -address -DOB -city -companies -country -createdAt -friends -gender -resume -signInWith -updatedAt -postalCode -mobile',
      )
      .sort({ createdAt: -1 });
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
    const comments = await this.userPostCommentsModel
      .find({ postId: postId })
      .populate(
        'userId',
        '-password -address -DOB -city -companies -country -createdAt -friends -gender -image -resume -signInWith -updatedAt -postalCode -mobile',
      )
      .sort({ createdAt: -1 });
    return comments;
  }

  // Like a Comment
  async likeAComment(commentId: string, userId: string): Promise<boolean> {
    const likeExist =await this.userPostCommentsModel.findOne({
      _id: commentId,
      likes: { $in: [userId] },
    });
    if(likeExist){
      await this.userPostCommentsModel.updateOne(
        { _id: commentId },
        { $pull: { likes: userId } },
      );
      return false
    }
    await this.userPostCommentsModel.updateOne(
      { _id: commentId },
      { $push: { likes: userId } },
    );
    return true
  }
}
