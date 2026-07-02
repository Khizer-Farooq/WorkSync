import { Module } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { ShiftsController } from './shifts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Shift } from './entities/shift.model';
import { User } from '../users/entities/user.model';
import { DashboardModule } from '../dashboard/dashboard.module';


@Module({
  imports: [SequelizeModule.forFeature([Shift, User])
  ,DashboardModule],
  controllers: [ShiftsController],
  providers: [ShiftsService],
  exports: [ShiftsService],
})
export class ShiftsModule {}
