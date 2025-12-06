import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { PrismaService } from '../prisma/prisma.service';
import { TodoResolver } from './todo.resolver';

@Module({
  providers: [TodoService, PrismaService, TodoResolver],
})
export class TodoModule {}
