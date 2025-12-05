import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [TodoModule],
  providers: [PrismaService],
})
export class AppModule {}
