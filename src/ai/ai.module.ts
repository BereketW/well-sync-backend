import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { RagService } from './rag/rag.service';
import { GeminiService } from './gemini/gemini.service';

@Module({
  imports: [PrismaModule],
  providers: [AiService, RagService, GeminiService],
  controllers: [AiController],
  exports: [AiService, RagService, GeminiService],
})
export class AiModule {}
