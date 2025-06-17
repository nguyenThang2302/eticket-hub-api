import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'src/database/model/message.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import { Organization } from 'src/database/entities/organization.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async saveMessage(data: {
    senderId: string;
    receiverId: string;
    message: string;
    isOrganizer: boolean;
  }): Promise<Message> {
    const newMessage = new this.messageModel(data);
    return newMessage.save();
  }

  async getMessagesOrganizer(organizerId: string) {
    const data = await this.messageModel
      .aggregate([
        {
          $match: {
            $or: [{ senderId: organizerId }, { receiverId: organizerId }],
          },
        },
        {
          $sort: {
            timestamp: -1,
          },
        },
        {
          $group: {
            _id: {
              otherParty: {
                $cond: {
                  if: { $eq: ['$senderId', organizerId] },
                  then: '$receiverId',
                  else: '$senderId',
                },
              },
            },
            latestMessage: { $first: '$$ROOT' },
          },
        },
        {
          $replaceRoot: { newRoot: '$latestMessage' },
        },
      ])
      .exec();

    // return data;

    const items = await Promise.all(
      data.reverse().map(async (message) => {
        let senderInfo = {};
        if (message.isOrganizer) {
          senderInfo = await this.userRepository.findOne({
            where: { id: message.receiverId },
            select: {
              id: true,
              name: true,
              avatar_url: true,
            },
          });
        } else {
          senderInfo = await this.userRepository.findOne({
            where: { id: message.senderId },
            select: {
              id: true,
              name: true,
              avatar_url: true,
            },
          });
        }

        return {
          id: message._id,
          sender_id: message.senderId,
          receiver_id: message.receiverId,
          message: message.message,
          is_organizer: message.isOrganizer,
          created_at: message.timestamp,
          sender_info: senderInfo,
        };
      }),
    );

    return { items };
  }

  async getMessagesDetails(
    receiverId: string,
    senderId: string,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;
    const data = await this.messageModel
      .find({
        $or: [
          { senderId: receiverId, receiverId: senderId },
          { senderId: senderId, receiverId: receiverId },
        ],
      })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const items = await Promise.all(
      data.reverse().map(async (message) => {
        let senderInfo;

        if (message.isOrganizer) {
          senderInfo = await this.organizationRepository.findOne({
            where: { id: message.senderId },
            select: {
              id: true,
              name: true,
              logo_url: true,
            },
          });
          senderInfo.avatar_url = senderInfo.logo_url;
          delete senderInfo.logo_url;
        } else {
          senderInfo = await this.userRepository.findOne({
            where: { id: message.senderId },
            select: {
              id: true,
              name: true,
              avatar_url: true,
            },
          });
        }

        return {
          id: message._id,
          sender_id: message.senderId,
          receiver_id: message.receiverId,
          message: message.message,
          is_organizer: message.isOrganizer,
          created_at: message.timestamp,
          sender_info: senderInfo,
        };
      }),
    );

    return { items };
  }

  async getMessagesUser(userId: string) {
    const data = await this.messageModel
      .aggregate([
        {
          $match: {
            $or: [{ senderId: userId }, { receiverId: userId }],
          },
        },
        {
          $sort: {
            timestamp: -1,
          },
        },
        {
          $group: {
            _id: {
              otherParty: {
                $cond: {
                  if: { $eq: ['$senderId', userId] },
                  then: '$receiverId',
                  else: '$senderId',
                },
              },
            },
            latestMessage: { $first: '$$ROOT' },
          },
        },
        {
          $replaceRoot: { newRoot: '$latestMessage' },
        },
      ])
      .exec();

    const items = await Promise.all(
      data.reverse().map(async (message) => {
        let senderInfo = {};
        if (message.isOrganizer) {
          senderInfo = await this.organizationRepository.findOne({
            where: { id: message.senderId },
            select: {
              id: true,
              name: true,
              logo_url: true,
            },
          });
          senderInfo['avatar_url'] = senderInfo['logo_url'];
        } else {
          senderInfo = await this.organizationRepository.findOne({
            where: { id: message.receiverId },
            select: {
              id: true,
              name: true,
              logo_url: true,
            },
          });
          senderInfo['avatar_url'] = senderInfo['logo_url'];
        }

        return {
          id: message._id,
          sender_id: message.senderId,
          receiver_id: message.receiverId,
          message: message.message,
          is_organizer: message.isOrganizer,
          created_at: message.timestamp,
          sender_info: senderInfo,
        };
      }),
    );

    return { items };
  }
}
