import { Injectable } from '@nestjs/common';
import { UserRequests } from 'src/requests/schema/userRequests.schema';
import { UserRepository } from 'src/user/repositories/user.repository';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getCurrentUserProfile(userId: string): Promise<User> {
    return this.userRepository.getCurrentUserProfile(userId);
  }

  async updateProfile(userDetails: any): Promise<User> {
    return this.userRepository.updateProfile(userDetails);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.getUserByEmail(email);
  }

  async connectFriend(userId: string, friendId: string): Promise<boolean> {
    return this.userRepository.connectFriend(userId, friendId);
  }

  async userFriends(userId: string): Promise<User[]> {
    return this.userRepository.userFriends(userId);
  }

  async getUserNotifications(userId: string): Promise<UserRequests[]> {
    return this.userRepository.getUserNotifications(userId);
  }

  async userAcceptSchedule(requestId: string): Promise<boolean> {
    return this.userRepository.userAcceptSchedule(requestId);
  }

  async userRejectSchedule(requestId: string): Promise<boolean> {
    return this.userRepository.userRejectSchedule(requestId);
  }

  async userRequestToChangeTime(requestId: string): Promise<boolean> {
    return this.userRepository.userRequestToChangeTime(requestId);
  }
}
