import {Table,Column,Model,DataType,ForeignKey,BelongsTo,BelongsToMany,} from 'sequelize-typescript';
import { ProjectStatus } from 'src/common/enums/project-status.enum';
import { User } from 'src/modules/users/entities/user.model';
import { ProjectMember } from './project-member.model';

interface ProjectCreationAttrs {
  title: string;
  description?: string | null;
  deadline?: string | null;
  createdBy: number;
  status?: ProjectStatus;
}

@Table({
  tableName: 'projects',
  timestamps: true,
  underscored: true,
})
export class Project extends Model<Project, ProjectCreationAttrs> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare createdBy: number;

  @BelongsTo(() => User, 'createdBy')
  declare creator: User;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  @Column({
    type: DataType.ENUM('ACTIVE', 'ARCHIVED', 'COMPLETED', 'CANCELED'),
    allowNull: false,
    defaultValue: 'ACTIVE',
  })
  declare status: ProjectStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare deadline: string | null;

  @BelongsToMany(() => User, () => ProjectMember)
  declare members: User[];
}
