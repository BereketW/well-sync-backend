import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AdminUserSummary {
  id: string;
  email: string;
  role: 'user' | 'coach' | 'admin';
  status: 'active' | 'suspended';
}

export interface KnowledgeSource {
  id: string;
  title: string;
  type: 'whitepaper' | 'peer_reviewed' | 'blog' | 'dataset';
  url: string;
  lastValidated: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  notes?: string;
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers(): Promise<AdminUserSummary[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map users to AdminUserSummary format
    // Note: role and status fields don't exist in current schema
    // Using default values until schema is updated
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      role: 'user' as const,
      status: 'active' as const,
    }));
  }

  async addKnowledgeSource(
    payload: Omit<KnowledgeSource, 'id'>,
  ): Promise<KnowledgeSource> {
    const source = await this.prisma.knowledgeSource.create({
      data: {
        title: payload.title,
        type: payload.type,
        url: payload.url,
        lastValidated: new Date(payload.lastValidated),
      },
    });

    return {
      id: source.id,
      title: source.title,
      type: source.type as KnowledgeSource['type'],
      url: source.url,
      lastValidated: source.lastValidated.toISOString(),
    };
  }

  async listLogs(): Promise<AuditLogEntry[]> {
    const logs = await this.prisma.auditLogEntry.findMany({
      orderBy: { timestamp: 'desc' },
    });

    return logs.map((log) => ({
      id: log.id,
      timestamp: log.timestamp.toISOString(),
      actor: log.actor,
      action: log.action,
      target: log.target,
      notes: log.notes ?? undefined,
    }));
  }
}
