import {Table,Column,Model,DataType,ForeignKey,BelongsTo,BelongsToMany,HasMany,} from 'sequelize-typescript';
import { Department } from '../../departments/entities/department.model';
import { UserRole } from '../../../common/enums/user-role.enum';
import { ProjectMember } from '../../projects/entities/project-member.model';
import { Project } from '../../projects/entities/project.model';
import { Task } from '../../tasks/entities/task.model';
import { TaskAssignment } from '../../tasks/entities/task-assignment.model';
import { TaskComment } from '../../task-comments/entities/task-comment.model';
import { Shift } from '../../shifts/entities/shift.model';

export interface UserCreationAttrs {
  name: string;
  email: string;
  password: string;
  departmentId?: number | null;
  role?: UserRole;
  isActive?: boolean;
}

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model<User, UserCreationAttrs> {


 @ForeignKey(() => Department)
@Column({
  field: 'department_id',
  type: DataType.INTEGER,
  allowNull: true,
})
declare departmentId: number | null;

  @BelongsTo(() => Department)
  declare department?: Department;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM(UserRole.ADMIN, UserRole.EMPLOYEE),
    allowNull: false,
    defaultValue: UserRole.EMPLOYEE,
  })
  declare role: UserRole;

  @Column({
     field: 'is_active',
  type: DataType.BOOLEAN,
  allowNull: false,
  defaultValue: true,
  })
  declare isActive: boolean;

  @HasMany(() => Project, 'createdBy')
declare createdProjects: Project[];

@BelongsToMany(() => Project, () => ProjectMember)
declare projects: Project[];

@HasMany(() => Task, 'createdBy')
declare createdTasks: Task[];

@BelongsToMany(() => Task, () => TaskAssignment)
declare assignedTasks: Task[];

@HasMany(() => TaskComment)
declare taskComments: TaskComment[];

@HasMany(() => Shift)
declare shifts: Shift[];
}
