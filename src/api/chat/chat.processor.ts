import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('chatProcessing')
export class ChatProcessor {
  @Process('sendNotification')
  async handleSendNotification(job: Job<any>) {
    const { senderId, receiverId, message } = job.data;
    try {
      console.log(`Processing notification for user ${receiverId}`);
    } catch (error) {
      console.error('Error processing notification:', error);
      throw error;
    }
  }
}
