import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WellnessModule } from './wellness/wellness.module';
import { AiModule } from './ai/ai.module';
import { ProgressModule } from './progress/progress.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
// import { AiModule } from './ai/ai.module';
// import { ProgressModule } from './progress/progress.module';
// import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    WellnessModule,
    AiModule,
    ProgressModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
