import {Controller,Get,Param,Post,Query,UseGuards,} from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { ShiftQueryDto } from './dto/shift-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { GetCurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/types/current-user.type';

@Controller('shifts')
@UseGuards(JwtAuthGuard)
export class ShiftsController {
 constructor(
  private readonly shiftsService: ShiftsService,
 ) {}

 @Post('clock-in')
 @UseGuards(RolesGuard)
 @Roles(UserRole.EMPLOYEE)
 clockIn(
  @GetCurrentUser() currentUser: CurrentUser,
 ) {
  return this.shiftsService.clockIn(currentUser);
 }

 @Post('clock-out')
 @UseGuards(RolesGuard)
 @Roles(UserRole.EMPLOYEE)
 clockOut(
  @GetCurrentUser() currentUser: CurrentUser,
 ) {
  return this.shiftsService.clockOut(currentUser);
 }

 @Get('active')
 @UseGuards(RolesGuard)
 @Roles(UserRole.EMPLOYEE)
 active(
  @GetCurrentUser() currentUser: CurrentUser,
 ) {
  return this.shiftsService.getMyActiveShift(currentUser);
 }

 @Get('weekly-hours')
 getWeeklyHours(
  @GetCurrentUser() currentUser: CurrentUser,
 ) {
  return this.shiftsService.getWeeklyWorkedHours(
   currentUser,
  );
 }

 @Get()
 findAll(
  @Query() query: ShiftQueryDto,
  @GetCurrentUser() currentUser: CurrentUser,
 ) {
  return this.shiftsService.findAll(
   query,
   currentUser,
  );
 }

 @Get(':id')
 findOne(
  @Param('id') id: string,
  @GetCurrentUser() currentUser: CurrentUser,
 ) {
  return this.shiftsService.findOne(
   Number(id),
   currentUser,
  );
 }
}