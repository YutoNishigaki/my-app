import { Injectable } from '@nestjs/common';
import { CleaningTask, Prisma, Room } from '@/generated/prisma/client';
import {
  CleaningTaskRepository,
  RoomRepository,
  TaskHistoryRepository,
} from './housekeeping.repository';
import {
  CompleteTaskInput,
  CreateCleaningTaskInput,
  CreateRoomInput,
  CycleType,
  RoomSort,
  TaskStatus,
  UpdateCleaningTaskInput,
  UpdateRoomInput,
} from './housekeeping.schema';

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 1000;
const MIN_CUSTOM_INTERVAL = 1;
const MAX_CUSTOM_INTERVAL = 365;

export const calculateNextScheduledAt = (
  baseDate: Date,
  cycleType: CycleType,
  customIntervalDays?: number | null,
): Date => {
  const next = new Date(baseDate.getTime());

  switch (cycleType) {
    case CycleType.DAILY:
      next.setDate(next.getDate() + 1);
      return next;
    case CycleType.WEEKLY:
      next.setDate(next.getDate() + 7);
      return next;
    case CycleType.MONTHLY:
      next.setMonth(next.getMonth() + 1);
      return next;
    case CycleType.CUSTOM:
      if (!customIntervalDays) {
        throw new Error('カスタム周期は customIntervalDays の指定が必須です');
      }
      next.setDate(next.getDate() + customIntervalDays);
      return next;
    default:
      return next;
  }
};

@Injectable()
export class HousekeepingService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly cleaningTaskRepository: CleaningTaskRepository,
    private readonly taskHistoryRepository: TaskHistoryRepository,
  ) {}

  async createRoom(data: CreateRoomInput): Promise<Room> {
    return this.roomRepository.create({
      user: { connect: { id: data.userId } },
      name: data.name,
      icon: data.icon,
      color: data.color,
    });
  }

  async updateRoom(roomId: string, data: UpdateRoomInput): Promise<Room> {
    return this.roomRepository.update({ where: { id: roomId }, data });
  }

  async archiveRoom(roomId: string): Promise<Room> {
    return this.roomRepository.update({
      where: { id: roomId },
      data: { archivedAt: new Date() },
    });
  }

  async restoreRoom(roomId: string): Promise<Room> {
    return this.roomRepository.update({
      where: { id: roomId },
      data: { archivedAt: null },
    });
  }

  async listRooms(params: {
    userId: string;
    includeArchived?: boolean;
    sortBy?: RoomSort;
  }): Promise<Room[]> {
    const { userId, includeArchived = false, sortBy = RoomSort.NAME } = params;
    const where = includeArchived ? { userId } : { userId, archivedAt: null };
    const orderBy: Prisma.RoomOrderByWithRelationInput =
      sortBy === RoomSort.LAST_ACTIVITY
        ? { updatedAt: 'desc' }
        : { name: 'asc' };

    return this.roomRepository.findMany({ where, orderBy });
  }

  async createCleaningTask(
    data: CreateCleaningTaskInput,
  ): Promise<CleaningTask> {
    this.validateTaskPayload(
      data.cycleType,
      data.title,
      data.description,
      data.customIntervalDays,
    );

    const nextScheduledAt =
      data.nextScheduledAt ??
      calculateNextScheduledAt(
        new Date(),
        data.cycleType,
        data.customIntervalDays,
      );

    return this.cleaningTaskRepository.create({
      room: { connect: { id: data.roomId } },
      user: { connect: { id: data.userId } },
      title: data.title,
      description: data.description,
      cycleType: data.cycleType,
      customIntervalDays:
        data.cycleType === CycleType.CUSTOM ? data.customIntervalDays : null,
      priority: data.priority,
      estimatedMinutes: data.estimatedMinutes,
      nextScheduledAt,
    });
  }

  async updateCleaningTask(
    taskId: string,
    data: UpdateCleaningTaskInput,
  ): Promise<CleaningTask> {
    if (data.title || data.description || data.cycleType) {
      this.validateTaskPayload(
        data.cycleType ?? CycleType.DAILY,
        data.title ?? 'placeholder',
        data.description,
        data.customIntervalDays,
        true,
      );
    }

    const nextScheduledAt =
      data.nextScheduledAt && data.cycleType
        ? calculateNextScheduledAt(
            data.nextScheduledAt,
            data.cycleType,
            data.customIntervalDays,
          )
        : data.nextScheduledAt;

    return this.cleaningTaskRepository.update({
      where: { id: taskId },
      data: {
        ...data,
        customIntervalDays:
          data.cycleType && data.cycleType !== CycleType.CUSTOM
            ? null
            : (data.customIntervalDays ?? undefined),
        nextScheduledAt,
      },
    });
  }

  async listCleaningTasks(roomId: string): Promise<CleaningTask[]> {
    return this.cleaningTaskRepository.findMany({
      where: { roomId },
      orderBy: { nextScheduledAt: 'asc' },
    });
  }

  async recordTaskProgress(input: CompleteTaskInput): Promise<CleaningTask> {
    const task = await this.cleaningTaskRepository.findUnique({
      id: input.taskId,
    });
    if (!task) {
      throw new Error('指定したタスクが見つかりません');
    }

    const completedAt = input.completedAt ?? new Date();
    const nextScheduledAt = this.resolveNextSchedule(
      task,
      input.status,
      completedAt,
    );

    const updatedTask = await this.cleaningTaskRepository.update({
      where: { id: task.id },
      data: {
        lastCompletedAt:
          input.status === TaskStatus.DONE ||
          input.status === TaskStatus.DELAYED
            ? completedAt
            : task.lastCompletedAt,
        skipCount:
          input.status === TaskStatus.SKIPPED
            ? task.skipCount + 1
            : task.skipCount,
        nextScheduledAt,
      },
    });

    await this.taskHistoryRepository.create({
      task: { connect: { id: task.id } },
      user: { connect: { id: input.userId } },
      status: input.status,
      memo: input.memo,
      attachmentUrl: input.attachmentUrl,
      completedAt,
    });

    return updatedTask;
  }

  private resolveNextSchedule(
    task: CleaningTask,
    status: TaskStatus,
    completedAt: Date,
  ): Date {
    if (status === TaskStatus.SKIPPED) {
      return calculateNextScheduledAt(
        task.nextScheduledAt ?? completedAt,
        task.cycleType as CycleType,
        task.customIntervalDays,
      );
    }

    return calculateNextScheduledAt(
      completedAt,
      task.cycleType as CycleType,
      task.customIntervalDays,
    );
  }

  private validateTaskPayload(
    cycleType: CycleType,
    title?: string,
    description?: string | null,
    customIntervalDays?: number | null,
    isPartial = false,
  ) {
    if (!isPartial) {
      if (!title || title.trim().length === 0) {
        throw new Error('タスク名は必須です');
      }
    }

    if (title && title.length > TITLE_MAX_LENGTH) {
      throw new Error('タスク名は100文字以内で入力してください');
    }

    if (description && description.length > DESCRIPTION_MAX_LENGTH) {
      throw new Error('説明は1,000文字以内で入力してください');
    }

    if (cycleType === CycleType.CUSTOM) {
      if (!customIntervalDays) {
        throw new Error('カスタム周期は1〜365日の間で指定してください');
      }

      if (
        customIntervalDays < MIN_CUSTOM_INTERVAL ||
        customIntervalDays > MAX_CUSTOM_INTERVAL
      ) {
        throw new Error('カスタム周期は1〜365日の間で指定してください');
      }
    } else if (customIntervalDays != null) {
      throw new Error('プリセット周期では customIntervalDays を指定できません');
    }
  }
}
