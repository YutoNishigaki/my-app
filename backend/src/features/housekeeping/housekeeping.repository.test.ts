/* eslint-disable @typescript-eslint/unbound-method */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CleaningTaskRepository,
  RoomRepository,
  TaskHistoryRepository,
} from './housekeeping.repository';
import { DatabaseClient } from '@/lib/database-client';

const createDatabaseClientMock = () => {
  const room = {
    create: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
  };

  const cleaningTask = {
    create: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
  };

  const taskHistory = {
    create: vi.fn(),
  };

  return { room, cleaningTask, taskHistory } as unknown as DatabaseClient;
};

describe('RoomRepository', () => {
  let databaseClient: DatabaseClient;
  let repository: RoomRepository;

  beforeEach(() => {
    databaseClient = createDatabaseClientMock();
    repository = new RoomRepository(databaseClient);
  });

  it('create: forwards data to Prisma client', async () => {
    const room = { id: 'room-1', name: 'リビング', userId: 'user-1' };
    (
      databaseClient.room.create as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(room);

    const result = await repository.create({
      name: 'リビング',
      user: { connect: { id: 'user-1' } },
    });

    expect(databaseClient.room.create).toHaveBeenCalledWith({
      data: { name: 'リビング', user: { connect: { id: 'user-1' } } },
    });
    expect(result).toBe(room);
  });

  it('update: forwards where and data', async () => {
    const room = { id: 'room-1', name: '寝室', userId: 'user-1' };
    (
      databaseClient.room.update as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(room);

    const result = await repository.update({
      where: { id: 'room-1' },
      data: { name: '寝室' },
    });

    expect(databaseClient.room.update).toHaveBeenCalledWith({
      where: { id: 'room-1' },
      data: { name: '寝室' },
    });
    expect(result).toBe(room);
  });

  it('findMany: forwards filters', async () => {
    const rooms = [{ id: 'room-1', name: '子供部屋', userId: 'user-1' }];
    (
      databaseClient.room.findMany as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(rooms);

    const result = await repository.findMany({ where: { userId: 'user-1' } });

    expect(databaseClient.room.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: undefined,
    });
    expect(result).toEqual(rooms);
  });
});

describe('CleaningTaskRepository', () => {
  let databaseClient: DatabaseClient;
  let repository: CleaningTaskRepository;

  beforeEach(() => {
    databaseClient = createDatabaseClientMock();
    repository = new CleaningTaskRepository(databaseClient);
  });

  it('create: forwards data', async () => {
    const task = {
      id: 'task-1',
      roomId: 'room-1',
      userId: 'user-1',
      title: '掃除',
    };
    (
      databaseClient.cleaningTask.create as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(task);

    const result = await repository.create({
      room: { connect: { id: 'room-1' } },
      user: { connect: { id: 'user-1' } },
      title: '掃除',
      cycleType: 'DAILY',
    });

    expect(databaseClient.cleaningTask.create).toHaveBeenCalledWith({
      data: {
        room: { connect: { id: 'room-1' } },
        user: { connect: { id: 'user-1' } },
        title: '掃除',
        cycleType: 'DAILY',
      },
    });
    expect(result).toBe(task);
  });

  it('update: forwards params', async () => {
    const task = { id: 'task-1', title: '窓掃除' };
    (
      databaseClient.cleaningTask.update as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(task);

    const result = await repository.update({
      where: { id: 'task-1' },
      data: { title: '窓掃除' },
    });

    expect(databaseClient.cleaningTask.update).toHaveBeenCalledWith({
      where: { id: 'task-1' },
      data: { title: '窓掃除' },
    });
    expect(result).toBe(task);
  });

  it('findMany: forwards filters', async () => {
    const tasks = [{ id: 'task-1', title: '洗面所', roomId: 'room-1' }];
    (
      databaseClient.cleaningTask.findMany as unknown as ReturnType<
        typeof vi.fn
      >
    ).mockResolvedValue(tasks);

    const result = await repository.findMany({ where: { roomId: 'room-1' } });

    expect(databaseClient.cleaningTask.findMany).toHaveBeenCalledWith({
      where: { roomId: 'room-1' },
      orderBy: undefined,
    });
    expect(result).toEqual(tasks);
  });

  it('findUnique: forwards where', async () => {
    const task = { id: 'task-1', title: '玄関', roomId: 'room-1' };
    (
      databaseClient.cleaningTask.findUnique as unknown as ReturnType<
        typeof vi.fn
      >
    ).mockResolvedValue(task);

    const result = await repository.findUnique({ id: 'task-1' });

    expect(databaseClient.cleaningTask.findUnique).toHaveBeenCalledWith({
      where: { id: 'task-1' },
    });
    expect(result).toBe(task);
  });
});

describe('TaskHistoryRepository', () => {
  let databaseClient: DatabaseClient;
  let repository: TaskHistoryRepository;

  beforeEach(() => {
    databaseClient = createDatabaseClientMock();
    repository = new TaskHistoryRepository(databaseClient);
  });

  it('create: forwards data', async () => {
    const history = { id: 'history-1', taskId: 'task-1', status: 'DONE' };
    (
      databaseClient.taskHistory.create as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(history);

    const completedAt = new Date('2024-01-01T00:00:00Z');
    const result = await repository.create({
      task: { connect: { id: 'task-1' } },
      user: { connect: { id: 'user-1' } },
      status: 'DONE',
      completedAt,
    });

    expect(databaseClient.taskHistory.create).toHaveBeenCalledWith({
      data: {
        task: { connect: { id: 'task-1' } },
        user: { connect: { id: 'user-1' } },
        status: 'DONE',
        completedAt,
      },
    });
    expect(result).toBe(history);
  });
});
