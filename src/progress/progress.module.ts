import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';

@Module({
  imports: [PrismaModule],
  providers: [ProgressService],
  controllers: [ProgressController],
  exports: [ProgressService],
})
export class ProgressModule {}
