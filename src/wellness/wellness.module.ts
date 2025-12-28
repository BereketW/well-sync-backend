import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WellnessService } from './wellness.service';
import { WellnessController } from './wellness.controller';

@Module({
  imports: [PrismaModule],
  providers: [WellnessService],
  controllers: [WellnessController],
  exports: [WellnessService],
})
export class WellnessModule {}
