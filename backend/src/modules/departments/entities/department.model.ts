import {Table,Column,Model,DataType,HasMany,} from 'sequelize-typescript';
import { User } from "../../users/entities/user.model";

interface DepartmentCreationAttrs {
  name: string;
}

@Table({
  tableName: 'departments',
  timestamps: true,
  underscored: true,
})
export class Department extends Model<Department, DepartmentCreationAttrs> {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @HasMany(() => User)
  declare users?: User[];
}
