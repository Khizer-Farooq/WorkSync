import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { DepartmentsModule } from './modules/departments/departments.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TaskCommentsModule } from './modules/task-comments/task-comments.module';
import { ShiftsModule } from './modules/shifts/shifts.module';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        uri: config.get<string>('DATABASE_URL'),
        autoLoadModels: true,
        synchronize: false, // keep false in production, use migrations instead
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // Neon requires SSL
          },
        },
      }),
    }),


    DepartmentsModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    TasksModule,
    TaskCommentsModule,
    ShiftsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}