import {Table,Column,Model,DataType,ForeignKey,BelongsTo} from 'sequelize-typescript';
import { User } from '../../users/entities/user.model';

interface ShiftCreationAttrs {
  userId: number;
  clockIn: Date;
  clockOut?: Date | null;
  shiftType?: string;
}

@Table({
    tableName:'shifts',
    timestamps:true,
    underscored:true,
})


export class Shift extends Model<Shift,ShiftCreationAttrs>{

    @ForeignKey(()=>User)
    @Column({
        type:DataType.INTEGER,
        allowNull:false,
    })
    declare userId:number;

    @BelongsTo(()=>User)
    declare user:User;

    @Column({
        type:DataType.DATE,
        allowNull:false,
    })
    declare clockIn:Date;


  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare clockOut: Date |null;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'REGULAR',
  })
  declare shiftType: string;

}