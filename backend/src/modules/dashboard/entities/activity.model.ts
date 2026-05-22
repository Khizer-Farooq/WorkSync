import {Table,Column,Model,DataType,ForeignKey,BelongsTo,} from 'sequelize-typescript';
import { User } from 'src/modules/users/entities/user.model';

interface ActivityCreationAttrs {
  userId?: number | null;
  action: string;
  entityType: string;
  entityId?: number | null;
  metadata?: any;
}

@Table({
  tableName: 'activities',
  timestamps: true,
  underscored: true,
})
export class Activity extends Model<Activity, ActivityCreationAttrs> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare userId: number | null;

  @BelongsTo(() => User)
  declare user: User;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare action: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare entityType: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare entityId: number | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  declare metadata: any | null;
}
