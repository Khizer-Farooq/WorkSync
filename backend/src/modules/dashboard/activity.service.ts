import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Activity } from './entities/activity.model';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity)
    private activityModel: typeof Activity,
  ) {}

  async createActivity(data: {
    userId?: number;
    action: string;
    entityType: string;
    entityId?: number;
    metadata?: any;
  }) {
    return this.activityModel.create({
      userId: data.userId ?? null,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId ?? null,
      metadata: data.metadata ?? null,
    });
  }
}
