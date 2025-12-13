import { Injectable } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class DatabaseClient extends PrismaClient {
  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('環境変数：DATABASE_URLは必須です');
    }

    const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
    super({ adapter });
  }
}
