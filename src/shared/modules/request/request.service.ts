import { Injectable, Scope } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private requestId: string;

  constructor() {
    this.requestId = nanoid(12);
  }

  getRequestId(): string {
    return this.requestId;
  }
}
