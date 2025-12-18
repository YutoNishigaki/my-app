import { Injectable } from '@nestjs/common';
import {
  CleaningTask,
  Prisma,
  Room,
  TaskHistory,
} from '@/generated/prisma/client';
import { DatabaseClient } from '@/lib/database-client';

@Injectable()
export class RoomRepository {
  constructor(private readonly databaseClient: DatabaseClient) {}

  create(data: Prisma.RoomCreateInput): Promise<Room> {
    return this.databaseClient.room.create({ data });
  }

  update(params: {
    where: Prisma.RoomWhereUniqueInput;
    data: Prisma.RoomUpdateInput;
  }): Promise<Room> {
    const { where, data } = params;
    return this.databaseClient.room.update({ where, data });
  }

  findMany(params: {
    where?: Prisma.RoomWhereInput;
    orderBy?: Prisma.RoomOrderByWithRelationInput;
  }): Promise<Room[]> {
    const { where, orderBy } = params;
    return this.databaseClient.room.findMany({ where, orderBy });
  }
}

@Injectable()
export class CleaningTaskRepository {
  constructor(private readonly databaseClient: DatabaseClient) {}

  create(data: Prisma.CleaningTaskCreateInput): Promise<CleaningTask> {
    return this.databaseClient.cleaningTask.create({ data });
  }

  update(params: {
    where: Prisma.CleaningTaskWhereUniqueInput;
    data: Prisma.CleaningTaskUpdateInput;
  }): Promise<CleaningTask> {
    const { where, data } = params;
    return this.databaseClient.cleaningTask.update({ where, data });
  }

  findMany(params: {
    where?: Prisma.CleaningTaskWhereInput;
    orderBy?: Prisma.CleaningTaskOrderByWithRelationInput;
  }): Promise<CleaningTask[]> {
    const { where, orderBy } = params;
    return this.databaseClient.cleaningTask.findMany({ where, orderBy });
  }

  findUnique(
    where: Prisma.CleaningTaskWhereUniqueInput,
  ): Promise<CleaningTask | null> {
    return this.databaseClient.cleaningTask.findUnique({ where });
  }
}

@Injectable()
export class TaskHistoryRepository {
  constructor(private readonly databaseClient: DatabaseClient) {}

  create(data: Prisma.TaskHistoryCreateInput): Promise<TaskHistory> {
    return this.databaseClient.taskHistory.create({ data });
  }
}
